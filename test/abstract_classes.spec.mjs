import {describe, it} from 'mocha';
import {expect} from 'chai';
import BaseAPI from '../src/BaseAPI.mjs';
import {BaseCMI} from '../src/cmi/common.mjs';

describe('Abstract Class Tests', () => {
  it('BaseAPI should not be instantiated', () => {
    expect(
        () => new BaseAPI(),
    ).to.throw('Cannot construct BaseAPI instances directly');
  });
  it('BaseCMI should not be instantiated', () => {
    expect(
        () => new BaseCMI(),
    ).to.throw('Cannot construct BaseCMI instances directly');
  });
});
