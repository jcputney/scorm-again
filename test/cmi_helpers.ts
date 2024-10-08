import { describe, it } from "mocha";
import { expect } from "expect";
import { getError } from "./api_helpers";
import { BaseCMI, BaseRootCMI } from "../src/cmi/common/base_cmi";

export type CheckFieldConstraintSize = {
  cmi: BaseCMI;
  fieldName: string;
  limit: number;
  expectedValue?: string;
  expectedError: number;
};

export type CheckReadOnly = {
  cmi: BaseCMI;
  fieldName: string;
  expectedValue?: string | number;
  expectedError: number;
};

export type CheckRead = {
  cmi: BaseCMI;
  fieldName: string;
  expectedValue?: string;
};

export type CheckReadAndWrite = {
  cmi: BaseCMI;
  fieldName: string;
  expectedValue?: string;
  valueToTest?: string;
};

export type CheckWriteOnly = {
  cmi: BaseCMI;
  fieldName: string;
  valueToTest?: string;
  expectedError: number;
};

export type CheckWrite = {
  cmi: BaseCMI;
  fieldName: string;
  valueToTest?: string;
};

export type CheckValidValues = {
  cmi: BaseCMI;
  fieldName: string;
  validValues: (string | number)[];
  invalidValues: string[];
};

export type CheckGetCurrentTotalTime = {
  cmi: BaseRootCMI;
  totalFieldName: string;
  sessionFieldName: string;
  startingTotal: string;
  sessionTime: string;
  expectedTotal: string;
};

export const checkFieldConstraintSize = ({
  cmi,
  fieldName,
  limit,
  expectedValue = "",
  expectedError,
}: CheckFieldConstraintSize) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).toEqual(expectedValue);
    });

    it(`Should be able to write upto ${limit} characters to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = 'x'.repeat(${limit})`)).not.toThrow();
    });

    it(`Should fail to write more than ${limit} characters to ${fieldName}`, async () => {
      const error = await getError(async () =>
        eval(`${fieldName} = 'x'.repeat(${limit + 1})`),
      );
      expect(error).toHaveProperty("errorCode", expectedError);
    });
  });
};

export const checkReadOnly = ({
  cmi,
  fieldName,
  expectedValue = "",
  expectedError,
}: CheckReadOnly) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).toEqual(expectedValue);
    });

    it(`Should fail to write to ${fieldName}`, async () => {
      const error = await getError(async () => eval(`${fieldName} = 'xxx'`));
      expect(error).toHaveProperty("errorCode", expectedError);
    });
  });
};

export const checkRead = ({
  cmi,
  fieldName,
  expectedValue = "",
}: CheckRead) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).toEqual(expectedValue);
    });
  });
};

export const checkReadAndWrite = ({
  cmi,
  fieldName,
  expectedValue = "",
  valueToTest = "xxx",
}: CheckReadAndWrite) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).toEqual(expectedValue);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).not.toThrow();
    });
  });
};

export const checkWriteOnly = ({
  cmi,
  fieldName,
  valueToTest = "xxx",
  expectedError,
}: CheckWriteOnly) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should fail to read from ${fieldName}`, async () => {
      const error = await getError(async () => eval(`${fieldName}`));
      expect(error).toHaveProperty("errorCode", expectedError);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).not.toThrow();
    });
  });
};

export const checkWrite = ({
  cmi,
  fieldName,
  valueToTest = "xxx",
}: CheckWrite) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).not.toThrow();
    });
  });
};

export const checkValidValues = ({
  cmi,
  fieldName,
  validValues,
  invalidValues,
}: CheckValidValues) => {
  describe(`Field: ${fieldName}`, () => {
    for (const idx in validValues) {
      if ({}.hasOwnProperty.call(validValues, idx)) {
        it(`Should successfully write '${validValues[idx]}' to ${fieldName}`, () => {
          expect(() =>
            eval(`${fieldName} = '${validValues[idx]}'`),
          ).not.toThrow();
        });
      }
    }

    for (const idx in invalidValues) {
      if ({}.hasOwnProperty.call(invalidValues, idx)) {
        it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`, () => {
          expect(() =>
            eval(`${fieldName} = '${invalidValues[idx]}'`),
          ).toThrow();
        });
      }
    }
  });
};

export const checkGetCurrentTotalTime = ({
  cmi: cmi,
  totalFieldName,
  sessionFieldName,
  startingTotal,
  sessionTime,
  expectedTotal,
}: CheckGetCurrentTotalTime) => {
  it(`Should return ${expectedTotal} with a starting time of ${startingTotal} and a session time of ${sessionTime}`, () => {
    eval(`${totalFieldName} = '${startingTotal}'`);
    eval(`${sessionFieldName} = '${sessionTime}'`);
    expect(cmi.getCurrentTotalTime()).toEqual(expectedTotal);
  });
};
