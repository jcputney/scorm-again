import {describe, it} from 'mocha';
import {expect} from 'chai';

export const checkWrite = (
    {
      api,
      fieldName,
      valueToTest = 'xxx',
      expectedError = 0,
    }) => {
  describe(`Field: ${fieldName}`, () => {
    const status = expectedError > 0 ? 'fail to' : 'successfully';
    it(`Should ${status} write to ${fieldName}`, () => {
      eval(`api.lmsSetValue('${fieldName}', '${valueToTest}')`);
      expect(String(api.lastErrorCode)).to.equal(String(expectedError));
    });
  });
};
