import { expect } from "expect";
import { describe, it } from "mocha";
import * as sinon from "sinon";
import { HttpService } from "../../src/services/HttpService";
import { EventService } from "../../src/services/EventService";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { LogLevelEnum } from "../../src/constants/enums";
import { Scorm2004API } from "../../src/Scorm2004API";
import Pretender from "fetch-pretender";

/**
 * Helper function to run multiple operations concurrently
 * @param operations Array of functions to run concurrently
 * @returns Promise that resolves when all operations are complete
 */
async function runConcurrently(operations: (() => Promise<any>)[]): Promise<any[]> {
  return Promise.all(operations.map(op => op()));
}

/**
 * Helper function to measure execution time of concurrent operations
 * @param operationFactory Function that returns an operation to run
 * @param concurrency Number of concurrent operations to run
 * @param iterations Number of iterations to run
 * @returns Average execution time in milliseconds
 */
async function measureConcurrentExecutionTime(
  operationFactory: () => Promise<any>,
  concurrency: number = 10,
  iterations: number = 10
): Promise<number> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const operations = Array(concurrency).fill(0).map(() => operationFactory);
    
    const start = performance.now();
    await runConcurrently(operations);
    const end = performance.now();
    
    times.push(end - start);
  }

  // Calculate average execution time
  return times.reduce((sum, time) => sum + time, 0) / times.length;
}

describe("Stress Tests for Concurrent Operations", () => {
  describe("HttpService Concurrent Requests", () => {
    let httpService: HttpService;
    let server: Pretender;
    let apiLogSpy: sinon.SinonSpy;
    let processListenersSpy: sinon.SinonSpy;

    beforeEach(() => {
      server = new Pretender();
      server.post("/scorm2004", () => {
        // Add a small delay to simulate network latency
        return new Promise(resolve => {
          setTimeout(() => {
            resolve([
              200,
              { "Content-Type": "application/json" },
              JSON.stringify({ result: "true", errorCode: 0 }),
            ]);
          }, 10);
        });
      });

      apiLogSpy = sinon.spy();
      processListenersSpy = sinon.spy();

      httpService = new HttpService(
        {
          lmsCommitUrl: "/scorm2004",
          logLevel: LogLevelEnum.NONE,
        },
        scorm2004_errors
      );
    });

    afterEach(() => {
      server.shutdown();
    });

    it("should handle multiple concurrent HTTP requests", async () => {
      const commitObject = {
        completionStatus: "completed",
        successStatus: "passed",
        score: {
          scaled: 0.8,
          raw: 80,
          min: 0,
          max: 100
        }
      };

      const concurrencyLevels = [5, 10, 20];
      
      for (const concurrency of concurrencyLevels) {
        const averageTime = await measureConcurrentExecutionTime(async () => {
          return httpService.processHttpRequest(
            "/scorm2004",
            commitObject,
            false,
            apiLogSpy,
            processListenersSpy
          );
        }, concurrency, 5);

        console.log(`Average time for ${concurrency} concurrent HTTP requests: ${averageTime.toFixed(3)} ms`);
        
        // The time should scale somewhat linearly with concurrency, but not perfectly due to parallelism
        // We're mainly checking that the system doesn't crash or timeout
        expect(averageTime).toBeLessThan(1000); // Expect less than 1 second even with high concurrency
      }
    });
  });

  describe("EventService Concurrent Events", () => {
    let eventService: EventService;
    let callbacks: sinon.SinonSpy[];

    beforeEach(() => {
      const apiLogSpy = sinon.spy();
      eventService = new EventService(apiLogSpy);
      callbacks = Array(100).fill(0).map(() => sinon.spy());
      
      // Register event listeners
      for (let i = 0; i < 100; i++) {
        eventService.on(`TestEvent${i % 10}`, callbacks[i]);
      }
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should handle multiple concurrent event triggers", async () => {
      const concurrencyLevels = [10, 20, 50];
      
      for (const concurrency of concurrencyLevels) {
        const operations = Array(concurrency).fill(0).map((_, i) => {
          return async () => {
            eventService.processListeners(`TestEvent${i % 10}`, `cmi.test.${i}`, `value${i}`);
          };
        });
        
        const start = performance.now();
        await runConcurrently(operations);
        const end = performance.now();
        
        const totalTime = end - start;
        console.log(`Time for ${concurrency} concurrent event triggers: ${totalTime.toFixed(3)} ms`);
        
        // Verify that all events were processed
        let callCount = 0;
        for (let i = 0; i < 100; i++) {
          callCount += callbacks[i].callCount;
        }
        
        // Each event should trigger approximately concurrency/10 callbacks
        // (since we have 10 unique event types and 100 callbacks)
        expect(callCount).toBeGreaterThanOrEqual(concurrency);
        expect(totalTime).toBeLessThan(500); // Should be fast even with high concurrency
      }
    });
  });

  describe("API Concurrent Operations", () => {
    let api: Scorm2004API;
    let server: Pretender;

    beforeEach(() => {
      server = new Pretender();
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({ result: "true", errorCode: 0 }),
        ];
      });

      api = new Scorm2004API({
        logLevel: LogLevelEnum.NONE,
        lmsCommitUrl: "/scorm2004",
      });

      api.Initialize("");
    });

    afterEach(() => {
      api.Terminate("");
      server.shutdown();
    });

    it("should handle concurrent SetValue operations", async () => {
      const concurrencyLevels = [10, 20, 50];
      
      for (const concurrency of concurrencyLevels) {
        const operations = Array(concurrency).fill(0).map((_, i) => {
          return async () => {
            const result = api.SetValue(`cmi.objectives.${i}.id`, `objective_${i}`);
            expect(result).toBe("true");
          };
        });
        
        const start = performance.now();
        await runConcurrently(operations);
        const end = performance.now();
        
        const totalTime = end - start;
        console.log(`Time for ${concurrency} concurrent SetValue operations: ${totalTime.toFixed(3)} ms`);
        
        // Verify that all values were set correctly
        for (let i = 0; i < concurrency; i++) {
          const value = api.GetValue(`cmi.objectives.${i}.id`);
          expect(value).toBe(`objective_${i}`);
        }
        
        expect(totalTime).toBeLessThan(500); // Should be fast even with high concurrency
      }
    });

    it("should handle concurrent GetValue operations", async () => {
      // Set up some values first
      for (let i = 0; i < 50; i++) {
        api.SetValue(`cmi.objectives.${i}.id`, `objective_${i}`);
      }
      
      const concurrencyLevels = [10, 20, 50];
      
      for (const concurrency of concurrencyLevels) {
        const operations = Array(concurrency).fill(0).map((_, i) => {
          return async () => {
            const value = api.GetValue(`cmi.objectives.${i % 50}.id`);
            expect(value).toBe(`objective_${i % 50}`);
          };
        });
        
        const start = performance.now();
        await runConcurrently(operations);
        const end = performance.now();
        
        const totalTime = end - start;
        console.log(`Time for ${concurrency} concurrent GetValue operations: ${totalTime.toFixed(3)} ms`);
        expect(totalTime).toBeLessThan(500); // Should be fast even with high concurrency
      }
    });

    it("should handle mixed concurrent operations (SetValue and GetValue)", async () => {
      const concurrencyLevels = [10, 20, 50];
      
      for (const concurrency of concurrencyLevels) {
        // Create a mix of SetValue and GetValue operations
        const operations = Array(concurrency).fill(0).map((_, i) => {
          if (i % 2 === 0) {
            // Even indices: SetValue
            return async () => {
              const result = api.SetValue(`cmi.interactions.${i}.id`, `interaction_${i}`);
              expect(result).toBe("true");
            };
          } else {
            // Odd indices: GetValue (on previously set values)
            return async () => {
              // Set the value first to ensure it exists
              api.SetValue(`cmi.interactions.${i-1}.id`, `interaction_${i-1}`);
              const value = api.GetValue(`cmi.interactions.${i-1}.id`);
              expect(value).toBe(`interaction_${i-1}`);
            };
          }
        });
        
        const start = performance.now();
        await runConcurrently(operations);
        const end = performance.now();
        
        const totalTime = end - start;
        console.log(`Time for ${concurrency} mixed concurrent operations: ${totalTime.toFixed(3)} ms`);
        expect(totalTime).toBeLessThan(1000); // Should be reasonably fast even with high concurrency
      }
    });

    it("should handle concurrent Commit operations", async () => {
      // Set up some values first
      for (let i = 0; i < 10; i++) {
        api.SetValue(`cmi.objectives.${i}.id`, `objective_${i}`);
      }
      
      const concurrencyLevels = [5, 10, 20];
      
      for (const concurrency of concurrencyLevels) {
        const operations = Array(concurrency).fill(0).map(() => {
          return async () => {
            const result = api.Commit("");
            expect(result).toBe("true");
          };
        });
        
        const start = performance.now();
        await runConcurrently(operations);
        const end = performance.now();
        
        const totalTime = end - start;
        console.log(`Time for ${concurrency} concurrent Commit operations: ${totalTime.toFixed(3)} ms`);
        expect(totalTime).toBeLessThan(2000); // Commit operations involve HTTP requests, so they take longer
      }
    });
  });
});