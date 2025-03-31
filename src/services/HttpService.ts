import { CommitObject, RefObject, ResultObject, Settings } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";

/**
 * Service for handling HTTP communication with the LMS
 */
export class HttpService {
  private settings: Settings;
  private apiLogLevel: string | number;
  private error_codes: any;

  /**
   * Constructor for HttpService
   * @param {Settings} settings - The settings object
   * @param {string|number} apiLogLevel - The log level
   * @param {any} error_codes - The error codes object
   */
  constructor(settings: Settings, apiLogLevel: string | number, error_codes: any) {
    this.settings = settings;
    this.apiLogLevel = apiLogLevel;
    this.error_codes = error_codes;
  }

  /**
   * Send the request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|RefObject|Array} params - The parameters to include in the request
   * @param {boolean} immediate - Whether to send the request immediately
   * @param {Function} apiLog - Function to log API messages
   * @param {Function} processListeners - Function to process event listeners
   * @return {ResultObject} - The result of the request
   */
  async processHttpRequest(
    url: string,
    params: CommitObject | RefObject | Array<any>,
    immediate: boolean = false,
    apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void
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
      params: CommitObject | RefObject | Array<any>,
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
   * @param {RefObject|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - The response from the LMS
   * @private
   */
  private async performFetch(
    url: string,
    params: RefObject | Array<any>,
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
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void
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
    } else {
      processListeners("CommitError");
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