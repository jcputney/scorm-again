import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling asynchronous HTTP communication with the LMS
 * WARNING: Not SCORM-compliant - always returns immediate success
 */
export class AsynchronousHttpService implements IHttpService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;

  /**
   * Constructor for AsynchronousHttpService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings: InternalSettings, error_codes: ErrorCode) {
    this.settings = settings;
    this.error_codes = error_codes;
  }

  /**
   * Sends HTTP requests asynchronously to the LMS
   * Returns immediate success - actual result handled via events
   *
   * WARNING: This is NOT SCORM-compliant. Always returns optimistic success immediately.
   * The actual HTTP request happens in the background, and success/failure is reported
   * via CommitSuccess/CommitError events, but NOT to the SCO's commit call.
   *
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether to send the request immediately without waiting
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {ResultObject} - Immediate optimistic success result
   */
  processHttpRequest(
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
  ): ResultObject {
    // Fire request in background - don't wait for result
    this._performAsyncRequest(url, params, immediate, apiLog, processListeners);

    // Immediately return optimistic success
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }

  /**
   * Performs the async request in the background
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @param {boolean} immediate - Whether this is an immediate request
   * @param apiLog - Function to log API messages
   * @param {Function} processListeners - Function to process event listeners
   * @private
   */
  private async _performAsyncRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): Promise<void> {
    try {
      const processedParams = this.settings.requestHandler(params) as
        | CommitObject
        | StringKeyMap
        | Array<any>;

      let response: Response;
      if (immediate && this.settings.useBeaconInsteadOfFetch !== "never") {
        response = await this.performBeacon(url, processedParams);
      } else {
        response = await this.performFetch(url, processedParams);
      }

      const result = await this.transformResponse(response, processListeners);

      // Trigger listeners based on actual result (after API method returns)
      if (this._isSuccessResponse(response, result)) {
        processListeners("CommitSuccess");
      } else {
        processListeners("CommitError", undefined, result.errorCode);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      apiLog("processHttpRequest", `Async request failed: ${message}`, LogLevelEnum.ERROR);
      processListeners("CommitError");
    }
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
    let result: any;

    try {
      // Parse the response using the configured handler or default to json
      result =
        typeof this.settings.responseHandler === "function"
          ? await this.settings.responseHandler(response)
          : await response.json();
    } catch (parseError) {
      // If we can't parse the response, log the raw response for debugging
      const responseText = await response.text().catch(() => "Unable to read response text");

      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
        errorMessage: `Failed to parse LMS response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
        errorDetails: JSON.stringify({
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          responseText: responseText.substring(0, 500), // Limit response text to avoid huge logs
          parseError: parseError instanceof Error ? parseError.message : String(parseError),
        }),
      };
    }

    // Ensure result has an errorCode property
    if (!Object.hasOwnProperty.call(result, "errorCode")) {
      result.errorCode = this._isSuccessResponse(response, result) ? 0 : this.error_codes.GENERAL;
    }

    // Add response details for failed requests
    if (!this._isSuccessResponse(response, result)) {
      result.errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        ...result.errorDetails, // Preserve any existing error details
      };
    }

    // Note: Event triggering is handled by _performAsyncRequest
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
      (value === true || value === "true" || value === global_constants.SCORM_TRUE)
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
