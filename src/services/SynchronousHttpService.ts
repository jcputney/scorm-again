import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling synchronous HTTP communication with the LMS
 * Uses synchronous XMLHttpRequest for SCORM-compliant error reporting
 */
export class SynchronousHttpService implements IHttpService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;

  /**
   * Constructor for SynchronousHttpService
   * @param {InternalSettings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings: InternalSettings, error_codes: ErrorCode) {
    this.settings = settings;
    this.error_codes = error_codes;
  }

  /**
   * Sends synchronous HTTP requests to the LMS
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether this is a termination commit (use sendBeacon)
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {ResultObject} - The result of the request (synchronous)
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
    apiLog: (functionName: string, message: any, messageLevel: number, CMIElement?: string) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): ResultObject {
    if (immediate) {
      // Termination: use sendBeacon (fire-and-forget, best effort)
      return this._handleImmediateRequest(url, params);
    }

    // Standard commit: synchronous XHR (blocks until complete)
    return this._performSyncXHR(url, params);
  }

  /**
   * Handles an immediate request using sendBeacon
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {ResultObject} - The result based on beacon success
   * @private
   */
  private _handleImmediateRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
  ): ResultObject {
    const requestPayload = this.settings.requestHandler(params) ?? params;
    const { body, contentType } = this._prepareRequestBody(requestPayload);

    const beaconSuccess = navigator.sendBeacon(url, new Blob([body], { type: contentType }));

    return {
      result: beaconSuccess ? "true" : "false",
      errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL || 101,
    };
  }

  /**
   * Performs a synchronous XMLHttpRequest
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {ResultObject} - The result of the request
   * @private
   */
  private _performSyncXHR(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
  ): ResultObject {
    const requestPayload = this.settings.requestHandler(params) ?? params;
    const { body, contentType } = this._prepareRequestBody(requestPayload);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // false = synchronous!

    // Set headers
    xhr.setRequestHeader("Content-Type", contentType);
    Object.entries(this.settings.xhrHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Set credentials
    if (this.settings.xhrWithCredentials) {
      xhr.withCredentials = true;
    }

    try {
      xhr.send(body);
      return this.settings.xhrResponseHandler(xhr);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
        errorMessage: message,
      };
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
   * Updates the service settings
   * @param {InternalSettings} settings - The new settings
   */
  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }
}
