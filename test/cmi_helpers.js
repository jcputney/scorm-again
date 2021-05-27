import {describe, it} from 'mocha';
import {expect} from 'chai';

export const checkFieldConstraintSize = (
    {
      cmi,
      fieldName,
      limit,
      expectedValue = '',
      expectedError,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should be able to write upto ${limit} characters to ${fieldName}`,
        () => {
          expect(() => eval(`${fieldName} = 'x'.repeat(${limit})`)).
              to.not.throw();
        });

    it(`Should fail to write more than ${limit} characters to ${fieldName}`,
        () => {
          expect(() => eval(`${fieldName} = 'x'.repeat(${limit + 1})`)).
              to.throw().with.property('errorCode', expectedError);
        });
  });
};

export const checkReadOnly = (
    {
      cmi,
      fieldName,
      expectedValue = '',
      expectedError,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should fail to write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = 'xxx'`)).
          to.throw().with.property('errorCode', expectedError);
    });
  });
};

export const checkRead = (
    {
      cmi,
      fieldName,
      expectedValue = '',
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });
  });
};

export const checkReadAndWrite = (
    {
      cmi,
      fieldName,
      expectedValue = '',
      valueToTest = 'xxx',
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).
          to.not.throw();
    });
  });
};

export const checkWriteOnly = (
    {
      cmi,
      fieldName,
      valueToTest = 'xxx',
      expectedError,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should fail to read from ${fieldName}`, () => {
      expect(() => eval(`${fieldName}`)).
          to.throw().with.property('errorCode', expectedError);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).to.not.throw();
    });
  });
};

export const checkWrite = (
    {
      cmi,
      fieldName,
      valueToTest = 'xxx',
    }) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).to.not.throw();
    });
  });
};

export const checkValidValues = (
    {
      cmi,
      fieldName,
      validValues,
      invalidValues,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    for (const idx in validValues) {
      if ({}.hasOwnProperty.call(validValues, idx)) {
        it(`Should successfully write '${validValues[idx]}' to ${fieldName}`,
            () => {
              expect(() => eval(`${fieldName} = '${validValues[idx]}'`)).
                  to.not.throw();
            });
      }
    }

    for (const idx in invalidValues) {
      if ({}.hasOwnProperty.call(invalidValues, idx)) {
        it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`,
            () => {
              expect(() => eval(`${fieldName} = '${invalidValues[idx]}'`)).
                  to.throw();
            });
      }
    }
  });
};

export const checkGetCurrentTotalTime = (
    {
      cmi: cmi,
      totalFieldName,
      sessionFieldName,
      startingTotal,
      sessionTime,
      expectedTotal,
    }) => {
  it(`Should return ${expectedTotal} with a starting time of ${startingTotal} and a session time of ${sessionTime}`,
      () => {
        eval(`${totalFieldName} = '${startingTotal}'`);
        eval(`${sessionFieldName} = '${sessionTime}'`);
        expect(
            cmi.getCurrentTotalTime(),
        ).to.equal(expectedTotal);
      });
};
