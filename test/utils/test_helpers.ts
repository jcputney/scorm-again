/**
 * Common test utilities for SCORM Again
 *
 * This file contains utility functions that can be used across different test files
 * to simplify test writing and reduce duplication.
 */

import { expect } from "expect";
import { BaseCMI } from "../../src/cmi/common/base_cmi";
import { BaseAPI } from "../../src/BaseAPI";

/**
 * Error thrown when no error is thrown during a test that expects an error
 */
export class NoErrorThrownError extends Error {
  constructor() {
    super("Expected an error to be thrown, but no error was thrown");
    this.name = "NoErrorThrownError";
  }
}

/**
 * Captures an error thrown by a function call
 *
 * @param call - The function call that is expected to throw an error
 * @returns The error that was thrown
 * @throws NoErrorThrownError if no error is thrown
 */
export const getError = async <TError>(call: () => unknown): Promise<TError> => {
  try {
    await call();
    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

/**
 * Safely gets a nested property value from an object using a path string
 * This is a safer alternative to using eval
 *
 * @param obj - The object to get the property from
 * @param path - The path to the property (e.g., "cmi.core.student_id")
 * @returns The value of the property, or undefined if the property doesn't exist
 */
export const getNestedProperty = (obj: any, path: string): any => {
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);
};

/**
 * Safely sets a nested property value on an object using a path string
 * This is a safer alternative to using eval
 *
 * @param obj - The object to set the property on
 * @param path - The path to the property (e.g., "cmi.core.student_id")
 * @param value - The value to set
 * @returns True if the property was set successfully, false otherwise
 */
export const setNestedProperty = (obj: any, path: string, value: any): boolean => {
  const parts = path.split(".");
  const lastPart = parts.pop();

  if (!lastPart) return false;

  const target = parts.reduce((prev, curr) => {
    if (prev && prev[curr] === undefined) {
      prev[curr] = {};
    }
    return prev && prev[curr] !== undefined ? prev[curr] : undefined;
  }, obj);

  if (target === undefined) return false;

  target[lastPart] = value;
  return true;
};

/**
 * Creates a snapshot of an object for comparison
 *
 * @param obj - The object to create a snapshot of
 * @returns A JSON string representation of the object
 */
export const createSnapshot = (obj: any): string => {
  return JSON.stringify(obj, null, 2);
};

/**
 * Compares an object to a snapshot
 *
 * @param obj - The object to compare
 * @param snapshot - The snapshot to compare against
 * @returns True if the object matches the snapshot, false otherwise
 */
export const matchesSnapshot = (obj: any, snapshot: string): boolean => {
  return JSON.stringify(obj, null, 2) === snapshot;
};

/**
 * Type-safe assertion for checking if a value is defined
 *
 * @param value - The value to check
 * @param message - The error message to throw if the value is undefined
 * @throws Error if the value is undefined
 */
export const assertDefined = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) {
    throw new Error(message);
  }
  return value;
};

/**
 * Type-safe assertion for checking if a value is not null
 *
 * @param value - The value to check
 * @param message - The error message to throw if the value is null
 * @throws Error if the value is null
 */
export const assertNotNull = <T>(value: T | null, message: string): T => {
  if (value === null) {
    throw new Error(message);
  }
  return value;
};

/**
 * Creates a test for checking if a field has a size constraint
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param limit - The maximum size of the field
 * @param expectedValue - The expected value of the field
 * @param expectedError - The expected error code if the field size is exceeded
 */
export const testFieldConstraintSize = (
  cmi: BaseCMI,
  fieldName: string,
  limit: number,
  expectedValue: string = "",
  expectedError: number
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(getNestedProperty(cmi, fieldName)).toEqual(expectedValue);
    });

    it(`Should be able to write up to ${limit} characters to ${fieldName}`, () => {
      expect(() => setNestedProperty(cmi, fieldName, "x".repeat(limit))).not.toThrow();
    });

    it(`Should fail to write more than ${limit} characters to ${fieldName}`, async () => {
      const error = await getError(async () => setNestedProperty(cmi, fieldName, "x".repeat(limit + 1)));
      expect(error).toHaveProperty("errorCode", expectedError);
    });
  });
};

/**
 * Creates a test for checking if a field is read-only
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param expectedValue - The expected value of the field
 * @param expectedError - The expected error code if writing to the field is attempted
 */
export const testReadOnly = (
  cmi: BaseCMI,
  fieldName: string,
  expectedValue: string | number = "",
  expectedError: number
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(getNestedProperty(cmi, fieldName)).toEqual(expectedValue);
    });

    it(`Should fail to write to ${fieldName}`, async () => {
      const error = await getError(async () => setNestedProperty(cmi, fieldName, "xxx"));
      expect(error).toHaveProperty("errorCode", expectedError);
    });
  });
};

/**
 * Creates a test for checking valid and invalid values for a field
 *
 * @param api - The API object
 * @param fieldName - The name of the field to test
 * @param validValues - An array of valid values for the field
 * @param invalidValues - An array of invalid values for the field
 */
export const testValidValues = (
  api: BaseAPI,
  fieldName: string,
  validValues: (string | number)[],
  invalidValues: string[]
) => {
  describe(`Field: ${fieldName}`, () => {
    for (const value of validValues) {
      it(`Should successfully write '${value}' to ${fieldName}`, () => {
        expect(api.lmsSetValue(fieldName, value)).toEqual("true");
      });
    }

    for (const value of invalidValues) {
      it(`Should fail to write '${value}' to ${fieldName}`, () => {
        expect(api.lmsSetValue(fieldName, value)).toEqual("false");
      });
    }
  });
};

/**
 * Creates a test for checking valid and invalid values for a CMI field
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param validValues - An array of valid values for the field
 * @param invalidValues - An array of invalid values for the field
 */
export const testCMIValidValues = (
  cmi: BaseCMI,
  fieldName: string,
  validValues: (string | number)[],
  invalidValues: string[]
) => {
  describe(`Field: ${fieldName}`, () => {
    for (const value of validValues) {
      it(`Should successfully write '${value}' to ${fieldName}`, () => {
        expect(() => setNestedProperty(cmi, fieldName, value)).not.toThrow();
      });
    }

    for (const value of invalidValues) {
      it(`Should fail to write '${value}' to ${fieldName}`, () => {
        expect(() => setNestedProperty(cmi, fieldName, value)).toThrow();
      });
    }
  });
};

/**
 * Creates a test for checking read and write operations on a field
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param expectedValue - The expected value of the field
 * @param valueToTest - The value to write to the field
 */
export const testReadAndWrite = (
  cmi: BaseCMI,
  fieldName: string,
  expectedValue: string = "",
  valueToTest: string = "xxx"
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(getNestedProperty(cmi, fieldName)).toEqual(expectedValue);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => setNestedProperty(cmi, fieldName, valueToTest)).not.toThrow();
    });
  });
};

/**
 * Creates a test for checking read operations on a field
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param expectedValue - The expected value of the field
 */
export const testRead = (
  cmi: BaseCMI,
  fieldName: string,
  expectedValue: string = ""
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(getNestedProperty(cmi, fieldName)).toEqual(expectedValue);
    });
  });
};

/**
 * Creates a test for checking write operations on a field
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param valueToTest - The value to write to the field
 */
export const testWrite = (
  cmi: BaseCMI,
  fieldName: string,
  valueToTest: string = "xxx"
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => setNestedProperty(cmi, fieldName, valueToTest)).not.toThrow();
    });
  });
};

/**
 * Creates a test for checking write-only fields
 *
 * @param cmi - The CMI object
 * @param fieldName - The name of the field to test
 * @param valueToTest - The value to write to the field
 * @param expectedError - The expected error code if reading from the field is attempted
 */
export const testWriteOnly = (
  cmi: BaseCMI,
  fieldName: string,
  valueToTest: string = "xxx",
  expectedError: number
) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should fail to read from ${fieldName}`, async () => {
      const error = await getError(async () => getNestedProperty(cmi, fieldName));
      expect(error).toHaveProperty("errorCode", expectedError);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => setNestedProperty(cmi, fieldName, valueToTest)).not.toThrow();
    });
  });
};

/**
 * Creates a test for checking time calculations
 *
 * @param cmi - The CMI object with getCurrentTotalTime method
 * @param totalFieldName - The name of the total time field
 * @param sessionFieldName - The name of the session time field
 * @param startingTotal - The starting total time
 * @param sessionTime - The session time
 * @param expectedTotal - The expected total time
 */
export const testGetCurrentTotalTime = (
  cmi: BaseCMI & { getCurrentTotalTime: () => string },
  totalFieldName: string,
  sessionFieldName: string,
  startingTotal: string,
  sessionTime: string,
  expectedTotal: string
) => {
  it(`Should return ${expectedTotal} with a starting time of ${startingTotal} and a session time of ${sessionTime}`, () => {
    setNestedProperty(cmi, totalFieldName, startingTotal);
    setNestedProperty(cmi, sessionFieldName, sessionTime);
    expect(cmi.getCurrentTotalTime()).toEqual(expectedTotal);
  });
};

/**
 * Creates a test for checking LMS setValue operations
 *
 * @param api - The API object
 * @param fieldName - The name of the field to test
 * @param valueToTest - The value to set
 * @param expectedError - The expected error code
 * @param errorThrown - Whether an error is expected to be thrown
 */
export const testLMSSetValue = (
  api: BaseAPI,
  fieldName: string,
  valueToTest: string | number = "xxx",
  expectedError: number = 0,
  errorThrown: boolean = false
) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? "fail to" : "successfully";
    it(`Should ${status} set value for ${fieldName}`, async () => {
      if (expectedError > 0) {
        if (errorThrown) {
          const error = await getError(async () => api.lmsSetValue(fieldName, valueToTest));
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(expectedError));
        }
      } else {
        if (errorThrown) {
          const error = await getError(async () => api.lmsSetValue(fieldName, valueToTest));
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(0));
        }
      }
    });
  });
};

/**
 * Creates a test for checking LMS getValue operations
 *
 * @param api - The API object
 * @param fieldName - The name of the field to test
 * @param expectedValue - The expected value
 * @param initializeFirst - Whether to initialize the field first
 * @param initializationValue - The value to initialize the field with
 * @param expectedError - The expected error code
 * @param errorThrown - Whether an error is expected to be thrown
 */
export const testLMSGetValue = (
  api: BaseAPI,
  fieldName: string,
  expectedValue: string = "",
  initializeFirst: boolean = false,
  initializationValue: string = "",
  expectedError: number = 0,
  errorThrown: boolean = false
) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? "fail to" : "successfully";

    if (initializeFirst) {
      api.setCMIValue(fieldName, initializationValue);
    }

    it(`Should ${status} get value for ${fieldName}`, async () => {
      if (expectedError > 0) {
        if (errorThrown) {
          const error = await getError(async () => api.lmsGetValue(fieldName));
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.lmsGetValue(fieldName);
          expect(String(api.lmsGetLastError())).toEqual(String(expectedError));
        }
      } else {
        expect(api.lmsGetValue(fieldName)).toEqual(expectedValue);
      }
    });
  });
};

/**
 * Creates a test for checking setCMIValue operations
 *
 * @param api - The API object
 * @param fieldName - The name of the field to test
 * @param valueToTest - The value to set
 * @param expectedError - The expected error code
 * @param errorThrown - Whether an error is expected to be thrown
 */
export const testSetCMIValue = (
  api: BaseAPI,
  fieldName: string,
  valueToTest: string = "xxx",
  expectedError: number = 0,
  errorThrown: boolean = true
) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? "fail to" : "successfully";
    it(`Should ${status} set CMI value for ${fieldName}`, async () => {
      if (expectedError > 0) {
        if (errorThrown) {
          const error = await getError(async () => api.setCMIValue(fieldName, valueToTest));
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.setCMIValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(expectedError));
        }
      } else {
        if (errorThrown) {
          expect(() => api.setCMIValue(fieldName, valueToTest)).not.toThrow();
        } else {
          api.setCMIValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(0));
        }
      }
    });
  });
};
