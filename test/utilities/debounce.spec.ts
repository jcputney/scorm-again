import { expect } from "expect";
import * as sinon from "sinon";
import { debounce } from "../../src/utilities/debounce";

describe("debounce", () => {
  it("executes the function after the specified wait time", (done) => {
    const mockFunction = sinon.spy();
    const debouncedFunction = debounce(mockFunction, 100);

    debouncedFunction();
    expect(mockFunction.called).toBe(false);

    setTimeout(() => {
      expect(mockFunction.called).toBe(true);
      done();
    }, 150);
  });

  it("executes the function immediately if immediate is true", () => {
    const mockFunction = sinon.spy();
    const debouncedFunction = debounce(mockFunction, 100, true);

    debouncedFunction();
    expect(mockFunction.called).toBe(true);
  });

  it("does not execute the function if called again within the wait time", (done) => {
    const mockFunction = sinon.spy();
    const debouncedFunction = debounce(mockFunction, 100);

    debouncedFunction();
    debouncedFunction();

    setTimeout(() => {
      expect(mockFunction.calledOnce).toBe(true);
      done();
    }, 150);
  });

  it("executes the function again after the wait time if called again", (done) => {
    const mockFunction = sinon.spy();
    const debouncedFunction = debounce(mockFunction, 100);

    debouncedFunction();

    setTimeout(() => {
      debouncedFunction();
      expect(mockFunction.calledOnce).toBe(true);

      setTimeout(() => {
        expect(mockFunction.calledTwice).toBe(true);
        done();
      }, 150);
    }, 150);
  });
});
