import {describe, it} from 'mocha';
import {expect} from 'chai';
import {ValidationError} from '../src/exceptions';

describe('Exception Tests', () => {
  it('ValidationException should return message string', () => {
    expect(
        new ValidationError(0, 'Error Message').message,
    ).to.equal('Error Message');
  });
  it('ValidationException should return errorCode number', () => {
    expect(
        new ValidationError(0, 'Error Message').errorCode,
    ).to.equal(0);
  });
});
