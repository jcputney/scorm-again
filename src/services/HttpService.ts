import { CommitObject, ResultObject, Settings } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling HTTP communication with the LMS
 */
export class HttpService implements IHttpService {
  private settings: Settings;
  private error_codes: ErrorCode;

  /**
   * Constructor for HttpService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings: Settings, error_codes: ErrorCode) {
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
    processListeners: (
      functionName: string,
      CMIElement?: string,
      value?: any,
    ) => void,
  ): Promise<ResultObject> {
    const genericError: ResultObject = {
      result: global_constants.SCORM_FALSE,
      errorCode: this.error_codes.GENERAL,
    };

    // if we are terminating the module or closing the browser window/tab, we need to make this fetch ASAP.
    // Some browsers, especially Chrome, do not like synchronous requests to be made when the window is closing.
    if (immediate) {
      this.performFetch(url, params).then(async (response) => {
        await this.transformResponse(response, processListeners);
      });
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      };
    }

    const process = async (
      url: string,
      params: CommitObject | StringKeyMap | Array<any>,
      settings: Settings,
    ): Promise<ResultObject> => {
      try {
        params = settings.requestHandler(params);
        const response = await this.performFetch(url, params);

        return this.transformResponse(response, processListeners);
      } catch (e) {
        apiLog("processHttpRequest", e, LogLevelEnum.ERROR);
        processListeners("CommitError");
        return genericError;
      }
    };

    return await process(url, params, this.settings);
  }

  /**
   * Perform the fetch request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {StringKeyMap|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - The response from the LMS
   * @private
   */
  private async performFetch(
    url: string,
    params: StringKeyMap | Array<any>,
  ): Promise<Response> {
    return fetch(url, {
      method: "POST",
      mode: this.settings.fetchMode,
      body: params instanceof Array ? params.join("&") : JSON.stringify(params),
      headers: {
        ...this.settings.xhrHeaders,
        "Content-Type": this.settings.commitRequestDataType,
      },
      credentials: this.settings.xhrWithCredentials ? "include" : undefined,
      keepalive: true,
    });
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
    processListeners: (
      functionName: string,
      CMIElement?: string,
      value?: any,
    ) => void,
  ): Promise<ResultObject> {
    const result =
      typeof this.settings.responseHandler === "function"
        ? await this.settings.responseHandler(response)
        : await response.json();

    if (
      response.status >= 200 &&
      response.status <= 299 &&
      (result.result === true || result.result === global_constants.SCORM_TRUE)
    ) {
      processListeners("CommitSuccess");
      if (!Object.hasOwnProperty.call(result, "errorCode")) {
        result.errorCode = 0;
      }
    } else {
      processListeners("CommitError");
      if (!Object.hasOwnProperty.call(result, "errorCode")) {
        result.errorCode = this.error_codes.GENERAL;
      }
    }
    return result;
  }

  /**
   * Updates the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: Settings): void {
    this.settings = settings;
  }
}
