import {describe, it} from 'mocha';
import {expect} from 'chai';
import {ValidationError} from '../src/exceptions';

describe('Exception Tests', () => {
  it('ValidationException should return message string', () => {
    expect(
        new ValidationError(0).message,
    ).to.equal('0');
  });
  it('ValidationException should return errorCode number', () => {
    expect(
        new ValidationError(0).errorCode,
    ).to.equal(0);
  });
});
