/**
 * Mock utilities for scorm-again tests
 *
 * This file contains utility functions for creating mock objects that can be used in tests.
 */

import { BaseAPI } from "../../src/BaseAPI";
import { BaseCMI } from "../../src/cmi/common/base_cmi";
import { ErrorCodes } from "../../src/constants/error_codes";
import { Settings } from "../../src/constants/settings";
import { DefaultSettings } from "../../src/constants/default_settings";

/**
 * Creates a mock HTTP response
 *
 * @param body - The response body
 * @param status - The response status code
 * @param headers - The response headers
 * @returns A mock Response object
 */
export const createMockResponse = (
  body: any = {},
  status: number = 200,
  headers: Record<string, string> = {},
): Response => {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status,
    headers: new Headers(headers),
  });
};

/**
 * Creates a mock SCORM API response
 *
 * @param result - The result of the operation
 * @param errorCode - The error code
 * @returns A mock Response object with SCORM API response format
 */
export const createMockScormResponse = (
  result: string = "true",
  errorCode: number = 0,
): Response => {
  return createMockResponse({
    result,
    errorCode,
  });
};

/**
 * Creates a mock settings object
 *
 * @param overrides - Settings properties to override
 * @returns A mock Settings object
 */
export const createMockSettings = (overrides: Partial<Settings> = {}): Settings => {
  return {
    ...DefaultSettings,
    ...overrides,
  };
};

/**
 * Creates a mock error codes object
 *
 * @param overrides - Error code properties to override
 * @returns A mock ErrorCodes object
 */
export const createMockErrorCodes = (overrides: Partial<ErrorCodes> = {}): ErrorCodes => {
  const defaultErrorCodes: ErrorCodes = {
    NO_ERROR: 0,
    GENERAL_EXCEPTION: 101,
    GENERAL_INITIALIZATION_FAILURE: 102,
    ALREADY_INITIALIZED: 103,
    CONTENT_INSTANCE_TERMINATED: 104,
    GENERAL_TERMINATION_FAILURE: 111,
    TERMINATION_BEFORE_INITIALIZATION: 112,
    TERMINATION_AFTER_TERMINATION: 113,
    RETRIEVE_DATA_BEFORE_INITIALIZATION: 122,
    RETRIEVE_DATA_AFTER_TERMINATION: 123,
    STORE_DATA_BEFORE_INITIALIZATION: 132,
    STORE_DATA_AFTER_TERMINATION: 133,
    COMMIT_BEFORE_INITIALIZATION: 142,
    COMMIT_AFTER_TERMINATION: 143,
    GENERAL_ARGUMENT_ERROR: 201,
    GENERAL_GET_FAILURE: 301,
    GENERAL_SET_FAILURE: 351,
    GENERAL_COMMIT_FAILURE: 391,
    UNDEFINED_DATA_MODEL_ELEMENT: 401,
    UNIMPLEMENTED_DATA_MODEL_ELEMENT: 402,
    DATA_MODEL_ELEMENT_VALUE_NOT_INITIALIZED: 403,
    DATA_MODEL_ELEMENT_IS_READ_ONLY: 404,
    DATA_MODEL_ELEMENT_IS_WRITE_ONLY: 405,
    DATA_MODEL_ELEMENT_TYPE_MISMATCH: 406,
    DATA_MODEL_ELEMENT_VALUE_OUT_OF_RANGE: 407,
    DATA_MODEL_DEPENDENCY_NOT_ESTABLISHED: 408,
    MALFORMED_PACKET: 1000,
    INVALID_FIELD_LENGTH: 1001,
    INVALID_FIELD_VALUE: 1002,
    UNSUPPORTED_VERSION: 1003,
    INVALID_SEQUENCE_NUMBER: 1004,
    INVALID_FIELD_COUNT: 1005,
    ABORT_PACKET: 1006,
    UNKNOWN_PACKET_TYPE: 1007,
    UNKNOWN_ERROR: 1008,
  };

  return {
    ...defaultErrorCodes,
    ...overrides,
  };
};

/**
 * Creates a mock CMI object
 *
 * @param overrides - Properties to override on the CMI object
 * @returns A mock BaseCMI object
 */
export const createMockCMI = (overrides: Partial<BaseCMI> = {}): BaseCMI => {
  const defaultCMI: BaseCMI = {
    initialize: sinon.stub(),
    terminate: sinon.stub(),
    getValue: sinon.stub(),
    setValue: sinon.stub(),
    commit: sinon.stub(),
    getLastError: sinon.stub().returns(0),
    getErrorString: sinon.stub().returns(""),
    getDiagnostic: sinon.stub().returns(""),
    toJSON: sinon.stub().returns({}),
  };

  return {
    ...defaultCMI,
    ...overrides,
  };
};

/**
 * Creates a mock BaseAPI instance
 *
 * @param overrides - Methods to override on the API
 * @param settings - Settings for the API
 * @returns A mock BaseAPI instance
 */
export const createMockAPI = (
  overrides: Partial<BaseAPI> = {},
  settings: Settings = DefaultSettings,
): BaseAPI => {
  const mockAPI = {
    isInitialized: false,
    isTerminated: false,
    lmsInitialize: sinon.stub().returns("true"),
    lmsTerminate: sinon.stub().returns("true"),
    lmsGetValue: sinon.stub().returns(""),
    lmsSetValue: sinon.stub().returns("true"),
    lmsCommit: sinon.stub().returns("true"),
    lmsGetLastError: sinon.stub().returns(0),
    lmsGetErrorString: sinon.stub().returns(""),
    lmsGetDiagnostic: sinon.stub().returns(""),
    getCMIValue: sinon.stub().returns(""),
    setCMIValue: sinon.stub(),
    processHttpRequest: sinon.stub().resolves({ result: "true", errorCode: 0 }),
    ...overrides,
  } as unknown as BaseAPI;

  return mockAPI;
};

/**
 * Creates a stub function that returns the provided value
 *
 * @param returnValue - The value to return
 * @returns A sinon stub
 */
export const createStub = <T>(returnValue: T): ReturnType<typeof vi.spyOn> => {
  return sinon.stub().returns(returnValue);
};

/**
 * Creates a spy on an object's method
 *
 * @param obj - The object containing the method
 * @param method - The name of the method to spy on
 * @returns A sinon spy
 */
export const createSpy = <T extends object, K extends keyof T>(
  obj: T,
  method: K,
): sinon.SinonSpy => {
  return sinon.spy(obj, method as string);
};

/**
 * Resets all stubs created with sinon
 */
export const resetAllStubs = (): void => {
  vi.clearAllMocks();
};

/**
 * Restores all spies and stubs created with sinon
 */
export const restoreAllStubs = (): void => {
  vi.restoreAllMocks();
};

/**
 * Creates a sandbox for isolating sinon stubs and spies
 *
 * @returns A sinon sandbox
 */
export const createSandbox = (): sinon.SinonSandbox => {
  return sinon.createSandbox();
};
