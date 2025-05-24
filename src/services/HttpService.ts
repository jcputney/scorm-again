import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling HTTP communication with the LMS
 */
export class HttpService implements IHttpService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;

  /**
   * Constructor for HttpService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings: InternalSettings, error_codes: ErrorCode) {
    this.settings = settings;
    this.error_codes = error_codes;
  }

  /**
   * Sends HTTP requests to the LMS with special handling for immediate and standard requests.
   *
   * This method handles communication with the LMS server, implementing two distinct
   * request handling strategies based on the context:
   *
   * 1. Immediate Mode (used during termination):
   *    When immediate=true, the method:
   *    - Initiates the fetch request but doesn't wait for it to complete
   *    - Returns a success result immediately
   *    - Processes the response asynchronously when it arrives
   *
   *    This is critical for browser compatibility during page unload/termination,
   *    as some browsers (especially Chrome) may cancel synchronous or awaited
   *    requests when a page is closing.
   *
   * 2. Standard Mode (normal operation):
   *    When immediate=false, the method:
   *    - Processes the request parameters through the configured requestHandler
   *    - Awaits the fetch response completely
   *    - Transforms the response using the configured responseHandler
   *    - Triggers appropriate event listeners based on success/failure
   *    - Returns the complete result with appropriate error codes
   *
   * The method also includes error handling to catch network failures or other
   * exceptions that might occur during the request process.
   *
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether to send the request immediately without waiting (true) or process normally (false)
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {Promise<ResultObject>} - A promise that resolves with the result of the request
   *
   * @example
   * // Standard request (waits for response)
   * const result = await httpService.processHttpRequest(
   *   "https://lms.example.com/commit",
   *   { cmi: { core: { lesson_status: "completed" } } },
   *   false,
   *   console.log,
   *   (event) => dispatchEvent(new CustomEvent(event))
   * );
   *
   * @example
   * // Immediate request (for termination)
   * const result = await httpService.processHttpRequest(
   *   "https://lms.example.com/commit",
   *   { cmi: { core: { lesson_status: "completed" } } },
   *   true,
   *   console.log,
   *   (event) => dispatchEvent(new CustomEvent(event))
   * );
   * // result will be success immediately, regardless of actual HTTP result
   */
  async processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): Promise<ResultObject> {
    const genericError: ResultObject = {
      result: global_constants.SCORM_FALSE,
      errorCode: this.error_codes.GENERAL,
    };

    // If immediate mode (for termination), handle differently
    if (immediate) {
      return this._handleImmediateRequest(url, params, apiLog, processListeners);
    }

    // Standard request processing
    try {
      const processedParams = this.settings.requestHandler(params) as
        | CommitObject
        | StringKeyMap
        | Array<any>;
      const response = await this.performFetch(url, processedParams);
      return this.transformResponse(response, processListeners);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      apiLog("processHttpRequest", message, LogLevelEnum.ERROR);
      processListeners("CommitError");
      return genericError;
    }
  }

  /**
   * Handles an immediate request (used during termination)
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @param {Function} processListeners - Function to process event listeners
   * @return {ResultObject} - A success result object
   * @private
   */
  private _handleImmediateRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): ResultObject {
    // Use Beacon API for final commit if specified in settings
    if (this.settings.useBeaconInsteadOfFetch !== "never") {
      const { body, contentType } = this._prepareRequestBody(params);
      navigator.sendBeacon(url, new Blob([body], { type: contentType }));
    } else {
      // Use regular fetch with keepalive
      this.performFetch(url, params)
        .then(async (response) => {
          await this.transformResponse(response, processListeners);
        })
        .catch((e: unknown) => {
          const message = e instanceof Error ? e.message : String(e);
          apiLog("processHttpRequest", message, LogLevelEnum.ERROR);
          processListeners("CommitError");
        });
    }

    // Return success immediately without waiting for response
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }

  /**
   * Prepares the request body and content type based on params type
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {Object} - Object containing body and contentType
   * @private
   */
  private _prepareRequestBody(params: CommitObject | StringKeyMap | Array<any>): {
    body: string;
    contentType: string;
  } {
    const body = params instanceof Array ? params.join("&") : JSON.stringify(params);
    const contentType =
      params instanceof Array
        ? "application/x-www-form-urlencoded"
        : this.settings.commitRequestDataType;

    return { body, contentType };
  }

  /**
   * Perform the fetch request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {StringKeyMap|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - The response from the LMS
   * @private
   */
  private async performFetch(url: string, params: StringKeyMap | Array<any>): Promise<Response> {
    // Use Beacon API if specified in settings
    if (this.settings.useBeaconInsteadOfFetch === "always") {
      return this.performBeacon(url, params);
    }

    const { body, contentType } = this._prepareRequestBody(params);
    const init = {
      method: "POST",
      mode: this.settings.fetchMode,
      body,
      headers: {
        ...this.settings.xhrHeaders,
        "Content-Type": contentType,
      },
      keepalive: true,
    } as RequestInit;

    if (this.settings.xhrWithCredentials) {
      init.credentials = "include";
    }

    return fetch(url, init);
  }

  /**
   * Perform the beacon request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {StringKeyMap|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - A promise that resolves with a mock Response object
   * @private
   */
  private async performBeacon(url: string, params: StringKeyMap | Array<any>): Promise<Response> {
    const { body, contentType } = this._prepareRequestBody(params);

    // Send the beacon request
    const beaconSuccess = navigator.sendBeacon(url, new Blob([body], { type: contentType }));

    // Create a mock Response object since sendBeacon doesn't return a Response
    return Promise.resolve({
      status: beaconSuccess ? 200 : 0,
      ok: beaconSuccess,
      json: async () => ({
        result: beaconSuccess ? "true" : "false",
        errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL,
      }),
      text: async () =>
        JSON.stringify({
          result: beaconSuccess ? "true" : "false",
          errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL,
        }),
    } as Response);
  }

  /**
   * Transforms the response from the LMS to a ResultObject
   * @param {Response} response - The response from the LMS
   * @param {Function} processListeners - Function to process event listeners
   * @return {Promise<ResultObject>} - The transformed response
   * @private
   */
  private async transformResponse(
    response: Response,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): Promise<ResultObject> {
    // Parse the response using the configured handler or default to json
    const result =
      typeof this.settings.responseHandler === "function"
        ? await this.settings.responseHandler(response)
        : await response.json();

    // Ensure result has an errorCode property
    if (!Object.hasOwnProperty.call(result, "errorCode")) {
      result.errorCode = this._isSuccessResponse(response, result) ? 0 : this.error_codes.GENERAL;
    }

    // Trigger appropriate event based on success/failure
    if (this._isSuccessResponse(response, result)) {
      processListeners("CommitSuccess");
    } else {
      processListeners("CommitError", undefined, result.errorCode);
    }

    return result;
  }

  /**
   * Determines if a response is successful based on status code and result
   * @param {Response} response - The HTTP response
   * @param {ResultObject} result - The parsed result object
   * @return {boolean} - Whether the response is successful
   * @private
   */
  private _isSuccessResponse(response: Response, result: ResultObject): boolean {
    const value = (result as any).result;
    return (
      response.status >= 200 &&
      response.status <= 299 &&
      (value === true ||
        value === "true" ||
        value === global_constants.SCORM_TRUE)
    );
  }

  /**
   * Updates the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }
}
