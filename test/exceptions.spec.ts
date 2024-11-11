import { describe, it } from "mocha";
import { expect } from "expect";
import { ValidationError } from "../src/exceptions";
import {
  aicc_constants,
  scorm12_constants,
  scorm2004_constants,
} from "../src/constants/api_constants";
import { AICCValidationError } from "../src/exceptions/aicc_exceptions";
import { Scorm12ValidationError } from "../src/exceptions/scorm12_exceptions";
import { Scorm2004ValidationError } from "../src/exceptions/scorm2004_exceptions";

const scorm12_errors = scorm12_constants.error_descriptions;
const aicc_errors = aicc_constants.error_descriptions;
const scorm2004_errors = scorm2004_constants.error_descriptions;

type CheckValidationMessage = {
  errorClass: any;
  errorCodes: number[];
  error_messages: any;
};

const checkValidationMessage = ({
  errorClass,
  errorCodes,
  error_messages,
}: CheckValidationMessage) => {
  describe(`ValidationError: ${typeof errorClass}`, () => {
    it(`${typeof errorClass} should return general errorCode number when not recognized`, () => {
      expect(new errorClass.prototype.constructor(53).errorCode).toEqual(101);
    });
    it(`${typeof errorClass}  should return general message when not recognized`, () => {
      expect(new errorClass.prototype.constructor(53).message).toEqual(
        error_messages["101"].basicMessage,
      );
    });

    for (let i = 0; i < errorCodes.length; i++) {
      const errorCode = errorCodes[i];
      it(`${typeof errorClass} should return proper errorCode number when recognized`, () => {
        expect(
          new errorClass.prototype.constructor(errorCode).errorCode,
        ).toEqual(errorCode);
      });
      it(`${typeof errorClass} should return proper ${errorCode} message`, () => {
        expect(new errorClass.prototype.constructor(errorCode).message).toEqual(
          error_messages[String(errorCode)].basicMessage,
        );
      });
    }
  });
};

describe("Exception Tests", () => {
  it("ValidationException should return message string", () => {
    expect(new ValidationError(0, "Error Message").message).toEqual(
      "Error Message",
    );
  });
  it("ValidationException should return errorCode number", () => {
    expect(new ValidationError(0, "Error Message").errorCode).toEqual(0);
  });
  checkValidationMessage({
    errorClass: AICCValidationError,
    errorCodes: [101, 201, 202, 203, 301, 401, 402, 403, 404, 405, 407, 408],
    error_messages: aicc_errors,
  });
  checkValidationMessage({
    errorClass: Scorm12ValidationError,
    errorCodes: [101, 201, 202, 203, 301, 401, 402, 403, 404, 405, 407, 408],
    error_messages: scorm12_errors,
  });
  checkValidationMessage({
    errorClass: Scorm2004ValidationError,
    errorCodes: [
      0, 101, 102, 103, 104, 111, 112, 113, 122, 123, 132, 133, 142, 143, 201,
      301, 351, 391, 401, 402, 403, 404, 405, 406, 407, 408,
    ],
    error_messages: scorm2004_errors,
  });
});
