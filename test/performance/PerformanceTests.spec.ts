import { expect } from "expect";
import { describe, it } from "mocha";
import * as sinon from "sinon";
import { SerializationService } from "../../src/services/SerializationService";
import { HttpService } from "../../src/services/HttpService";
import { EventService } from "../../src/services/EventService";
import { validationService } from "../../src/services/ValidationService";
import { memoize } from "../../src/utilities";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { LogLevelEnum } from "../../src/constants/enums";
import { BaseCMI } from "../../src/cmi/common/base_cmi";
import { Scorm2004API } from "../../src/Scorm2004API";
import Pretender from "fetch-pretender";

/**
 * Helper function to measure execution time of a function
 * @param fn Function to measure
 * @param iterations Number of iterations to run
 * @returns Average execution time in milliseconds
 */
async function measureExecutionTime(
  fn: () => any | Promise<any>,
  iterations: number = 100,
): Promise<number> {
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }

  // Calculate average execution time
  return times.reduce((sum, time) => sum + time, 0) / times.length;
}

describe("Performance Tests", () => {
  describe("SerializationService Performance", () => {
    let serializationService: SerializationService;
    let mockCMI: BaseCMI;

    beforeEach(() => {
      serializationService = new SerializationService();
      mockCMI = {
        initialized: true,
        _children: {},
        _count: {},
        toJSON: () => ({
          score: {
            scaled: 0.8,
            raw: 80,
            min: 0,
            max: 100,
          },
          completion_status: "completed",
          success_status: "passed",
          learner_id: "12345",
          learner_name: "John Doe",
          interactions: [
            {
              id: "interaction_1",
              type: "choice",
              description: "Test interaction",
              timestamp: "2023-01-01T12:00:00Z",
              weighting: 1,
              learner_response: "choice_1",
              result: "correct",
              latency: "PT1M30S",
              objectives: [{ id: "objective_1" }],
            },
          ],
        }),
      } as unknown as BaseCMI;
    });

    it("should measure renderCMIToJSONString performance", async () => {
      const averageTime = await measureExecutionTime(() => {
        serializationService.renderCMIToJSONString(mockCMI, true);
      }, 1000);

      console.log(`Average time for renderCMIToJSONString: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(5); // Expect less than 5ms on average
    });

    it("should measure renderCMIToJSONObject performance", async () => {
      const averageTime = await measureExecutionTime(() => {
        serializationService.renderCMIToJSONObject(mockCMI, true);
      }, 1000);

      console.log(`Average time for renderCMIToJSONObject: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(5); // Expect less than 5ms on average
    });
  });

  describe("HttpService Performance", () => {
    let httpService: HttpService;
    let server: Pretender;
    let apiLogSpy: sinon.SinonSpy;
    let processListenersSpy: sinon.SinonSpy;

    beforeEach(() => {
      server = new Pretender();
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({ result: "true", errorCode: 0 }),
        ];
      });

      apiLogSpy = sinon.spy();
      processListenersSpy = sinon.spy();

      httpService = new HttpService(
        {
          lmsCommitUrl: "/scorm2004",
          logLevel: LogLevelEnum.NONE,
        },
        scorm2004_errors,
      );
    });

    afterEach(() => {
      server.shutdown();
    });

    it("should measure HTTP request performance", async () => {
      const commitObject = {
        completionStatus: "completed",
        successStatus: "passed",
        score: {
          scaled: 0.8,
          raw: 80,
          min: 0,
          max: 100,
        },
      };

      const averageTime = await measureExecutionTime(async () => {
        await httpService.processHttpRequest(
          "/scorm2004",
          commitObject,
          false,
          apiLogSpy,
          processListenersSpy,
        );
      }, 20); // Fewer iterations for network requests

      console.log(`Average time for HTTP request: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(100); // Expect less than 100ms on average for local requests
    });
  });

  describe("EventService Performance", () => {
    let eventService: EventService;
    let callbacks: sinon.SinonSpy[];

    beforeEach(() => {
      const apiLogSpy = sinon.spy();
      eventService = new EventService(apiLogSpy);
      callbacks = Array(100)
        .fill(0)
        .map(() => sinon.spy());
    });

    afterEach(() => {
      sinon.restore();
    });

    it("should measure event registration performance", async () => {
      const averageTime = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          eventService.on(`TestEvent${i}`, callbacks[i]);
        }
      });

      console.log(`Average time for registering 100 events: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(50); // Expect less than 50ms for registering 100 events
    });

    it("should measure event triggering performance", async () => {
      // Register 100 event listeners first
      for (let i = 0; i < 100; i++) {
        eventService.on(`TestEvent`, callbacks[i]);
      }

      const averageTime = await measureExecutionTime(() => {
        eventService.processListeners("TestEvent", "cmi.score.scaled", "0.8");
      }, 100);

      console.log(`Average time for triggering 100 event listeners: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(50); // Expect less than 50ms for triggering 100 events
    });

    it("should measure wildcard event matching performance", async () => {
      // Register 100 wildcard event listeners
      for (let i = 0; i < 100; i++) {
        eventService.on(`SetValue.cmi.interactions.${i}.*`, callbacks[i]);
      }

      const averageTime = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          eventService.processListeners("SetValue", `cmi.interactions.${i}.result`, "correct");
        }
      });

      console.log(`Average time for 100 wildcard event matches: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(100); // Expect less than 100ms for 100 wildcard matches
    });
  });

  describe("ValidationService Performance", () => {
    it("should measure validation performance for scores", async () => {
      const averageTime = await measureExecutionTime(() => {
        for (let i = 0; i < 100; i++) {
          validationService.validateScore("cmi.score.scaled", i / 100, 0, 1);
          validationService.validateScore("cmi.score.raw", i, 0, 100);
        }
      }, 100);

      console.log(`Average time for 200 score validations: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(10); // Expect less than 10ms for 200 validations
    });
  });

  describe("Memoization Performance", () => {
    it("should measure performance improvement with memoization", async () => {
      // Create an expensive function
      const expensiveFunction = (n: number): number => {
        let result = 0;
        for (let i = 0; i < 10000; i++) {
          result += Math.sin(n * i);
        }
        return result;
      };

      // Create a memoized version
      const memoizedFunction = memoize(expensiveFunction);

      // Measure non-memoized performance (first call)
      const nonMemoizedTime = await measureExecutionTime(() => {
        expensiveFunction(42);
      }, 20);

      // Measure memoized performance (repeated calls with same argument)
      const memoizedTime = await measureExecutionTime(() => {
        memoizedFunction(42);
      }, 100);

      console.log(`Average time without memoization: ${nonMemoizedTime.toFixed(3)} ms`);
      console.log(`Average time with memoization: ${memoizedTime.toFixed(3)} ms`);

      // Memoized version should be significantly faster
      expect(memoizedTime).toBeLessThan(nonMemoizedTime * 0.1);
    });
  });

  describe("API Performance", () => {
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

    it("should measure SetValue performance", async () => {
      const averageTime = await measureExecutionTime(() => {
        api.SetValue("cmi.score.scaled", "0.8");
        api.SetValue("cmi.score.raw", "80");
        api.SetValue("cmi.completion_status", "completed");
        api.SetValue("cmi.success_status", "passed");
      }, 100);

      console.log(`Average time for 4 SetValue operations: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(10); // Expect less than 10ms for 4 SetValue operations
    });

    it("should measure GetValue performance", async () => {
      // Set some values first
      api.SetValue("cmi.score.scaled", "0.8");
      api.SetValue("cmi.score.raw", "80");
      api.SetValue("cmi.completion_status", "completed");
      api.SetValue("cmi.success_status", "passed");

      const averageTime = await measureExecutionTime(() => {
        api.GetValue("cmi.score.scaled");
        api.GetValue("cmi.score.raw");
        api.GetValue("cmi.completion_status");
        api.GetValue("cmi.success_status");
      }, 100);

      console.log(`Average time for 4 GetValue operations: ${averageTime.toFixed(3)} ms`);
      expect(averageTime).toBeLessThan(10); // Expect less than 10ms for 4 GetValue operations
    });
  });
});
