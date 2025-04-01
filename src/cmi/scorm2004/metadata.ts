/**
 * Class representing metadata properties for SCORM 2004's cmi object
 */
import { scorm2004_constants } from "../../constants/api_constants";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";

/**
 * Class representing metadata properties for SCORM 2004's cmi object
 */
export class CMIMetadata extends BaseCMI {
  private __version = "1.0";
  private __children = scorm2004_constants.cmi_children;

  /**
   * Constructor for CMIMetadata
   */
  constructor() {
    super();
  }

  /**
   * Getter for __version
   * @return {string}
   */
  get _version(): string {
    return this.__version;
  }

  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   */
  set _version(_version: string) {
    throw new Scorm2004ValidationError(scorm2004_errors.READ_ONLY_ELEMENT);
  }

  /**
   * Getter for __children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for __children. Just throws an error.
   * @param {number} _children
   */
  set _children(_children: number) {
    throw new Scorm2004ValidationError(scorm2004_errors.READ_ONLY_ELEMENT);
  }

  /**
   * Reset the metadata properties
   */
  reset(): void {
    this._initialized = false;
    // No need to reset __version and __children as they are constants
  }
}