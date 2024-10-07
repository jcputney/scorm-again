import { describe, it } from "mocha";
import { expect } from "expect";
import BaseAPI from "../src/BaseAPI";

class NoErrorThrownError extends Error {}

export const getError = async <TError>(
  call: () => unknown,
): Promise<TError> => {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
};

export type CheckValidValues = {
  api: BaseAPI;
  fieldName: string;
  validValues: (string | number)[];
  invalidValues: string[];
};

export type CheckLMSSetValue = {
  api: BaseAPI;
  fieldName: string;
  valueToTest?: string | number;
  expectedError?: number;
  errorThrown?: boolean;
};

export type CheckLMSGetValue = {
  api: BaseAPI;
  fieldName: string;
  expectedValue?: string;
  initializeFirst?: boolean;
  initializationValue?: string;
  expectedError?: number;
  errorThrown?: boolean;
};

export type CheckSetCMIValue = {
  api: BaseAPI;
  fieldName: string;
  valueToTest?: string;
  expectedError?: number;
  errorThrown?: boolean;
};

export const checkValidValues = ({
  api,
  fieldName,
  validValues,
  invalidValues,
}: CheckValidValues) => {
  describe(`Field: ${fieldName}`, () => {
    for (const idx in validValues) {
      if ({}.hasOwnProperty.call(validValues, idx)) {
        it(`Should successfully write '${validValues[idx]}' to ${fieldName}`, () => {
          expect(api.lmsSetValue(fieldName, validValues[idx])).toEqual("true");
        });
      }
    }

    for (const idx in invalidValues) {
      if ({}.hasOwnProperty.call(invalidValues, idx)) {
        it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`, () => {
          expect(api.lmsSetValue(fieldName, invalidValues[idx])).toEqual(
            "false",
          );
        });
      }
    }
  });
};

export const checkLMSSetValue = ({
  api,
  fieldName,
  valueToTest = "xxx",
  expectedError = 0,
  errorThrown = false,
}: CheckLMSSetValue) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? "fail to" : "successfully";
    it(`Should ${status} set value for ${fieldName}`, async () => {
      if (expectedError > 0) {
        if (errorThrown) {
          const error = await getError(async () =>
            api.lmsSetValue(fieldName, valueToTest),
          );
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(expectedError));
        }
      } else {
        if (errorThrown) {
          const error = await getError(async () =>
            api.lmsSetValue(fieldName, valueToTest),
          );
          expect(error).toHaveProperty("errorCode", expectedError);
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).toEqual(String(0));
        }
      }
    });
  });
};

export const checkLMSGetValue = ({
  api,
  fieldName,
  expectedValue = "",
  initializeFirst = false,
  initializationValue = "",
  expectedError = 0,
  errorThrown = false,
}: CheckLMSGetValue) => {
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

export const checkSetCMIValue = ({
  api,
  fieldName,
  valueToTest = "xxx",
  expectedError = 0,
  errorThrown = true,
}: CheckSetCMIValue) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? "fail to" : "successfully";
    it(`Should ${status} set CMI value for ${fieldName}`, async () => {
      if (expectedError > 0) {
        if (errorThrown) {
          const error = await getError(async () =>
            api.setCMIValue(fieldName, valueToTest),
          );
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
