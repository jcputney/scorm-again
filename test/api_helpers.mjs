import {describe, it} from 'mocha';
import {expect} from 'chai';

export const checkValidValues = (
    {
      api,
      fieldName,
      validValues,
      invalidValues,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    for (const idx in validValues) {
      if ({}.hasOwnProperty.call(validValues, idx)) {
        it(`Should successfully write '${validValues[idx]}' to ${fieldName}`,
            () => {
              expect(api.lmsSetValue(fieldName, validValues[idx])).
                  to.equal('true');
            });
      }
    }

    for (const idx in invalidValues) {
      if ({}.hasOwnProperty.call(invalidValues, idx)) {
        it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`,
            () => {
              expect(api.lmsSetValue(fieldName, invalidValues[idx])).
                  to.equal('false');
            });
      }
    }
  });
};

export const checkLMSSetValue = (
    {
      api,
      fieldName,
      valueToTest = 'xxx',
      expectedError = 0,
      errorThrown = false,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? 'fail to' : 'successfully';
    it(`Should ${status} set value for ${fieldName}`, () => {
      if (expectedError > 0) {
        if (errorThrown) {
          expect(() => api.lmsSetValue(fieldName, valueToTest)).
              to.throw().with.property('errorCode', expectedError);
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).to.equal(String(expectedError));
        }
      } else {
        if (errorThrown) {
          expect(() => api.lmsSetValue(fieldName, valueToTest)).
              to.not.throw();
        } else {
          api.lmsSetValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).to.equal(String(0));
        }
      }
    });
  });
};

export const checkLMSGetValue = (
    {
      api,
      fieldName,
      expectedValue = '',
      initializeFirst = false,
      initializationValue = '',
      expectedError = 0,
      errorThrown = false,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? 'fail to' : 'successfully';

    if (initializeFirst) {
      api.setCMIValue(fieldName, initializationValue);
    }

    it(`Should ${status} get value for ${fieldName}`, () => {
      if (expectedError > 0) {
        if (errorThrown) {
          expect(() => api.lmsGetValue(fieldName)).
              to.throw().with.property('errorCode', expectedError);
        } else {
          api.lmsGetValue(fieldName);
          expect(String(api.lmsGetLastError())).to.equal(String(expectedError));
        }
      } else {
        expect(api.lmsGetValue(fieldName)).to.equal(expectedValue);
      }
    });
  });
};

export const checkSetCMIValue = (
    {
      api,
      fieldName,
      valueToTest = 'xxx',
      expectedError = 0,
      errorThrown = true,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? 'fail to' : 'successfully';
    it(`Should ${status} set CMI value for ${fieldName}`, () => {
      if (expectedError > 0) {
        if (errorThrown) {
          expect(() => api.setCMIValue(fieldName, valueToTest)).
              to.throw().with.property('errorCode', expectedError);
        } else {
          api.setCMIValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).to.equal(String(expectedError));
        }
      } else {
        if (errorThrown) {
          expect(() => api.setCMIValue(fieldName, valueToTest)).to.not.throw();
        } else {
          api.setCMIValue(fieldName, valueToTest);
          expect(String(api.lmsGetLastError())).to.equal(String(0));
        }
      }
    });
  });
};
