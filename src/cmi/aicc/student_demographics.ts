import { BaseCMI } from "../common/base_cmi";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { aicc_constants } from "../../constants/api_constants";
import { scorm12_errors } from "../../constants/error_codes";

/**
 * Class representing the AICC cmi.student_demographics object
 */
export class CMIStudentDemographics extends BaseCMI {
  private __children = aicc_constants.student_demographics_children;
  private _city = "";
  private _class = "";
  private _company = "";
  private _country = "";
  private _experience = "";
  private _familiar_name = "";
  private _instructor_name = "";
  private _title = "";
  private _native_language = "";
  private _state = "";
  private _street_address = "";
  private _telephone = "";
  private _years_experience = "";

  /**
   * Constructor for AICC StudentDemographics object
   */
  constructor() {
    super();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
  }

  /**
   * Getter for _children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Getter for city
   * @return {string}
   */
  get city(): string {
    return this._city;
  }

  /**
   * Setter for _city. Sets an error if trying to set after
   *  initialization.
   * @param {string} city
   */
  set city(city: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._city = city;
    }
  }

  /**
   * Getter for class
   * @return {string}
   */
  get class(): string {
    return this._class;
  }

  /**
   * Setter for _class. Sets an error if trying to set after
   *  initialization.
   * @param {string} clazz
   */
  set class(clazz: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._class = clazz;
    }
  }

  /**
   * Getter for company
   * @return {string}
   */
  get company(): string {
    return this._company;
  }

  /**
   * Setter for _company. Sets an error if trying to set after
   *  initialization.
   * @param {string} company
   */
  set company(company: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._company = company;
    }
  }

  /**
   * Getter for country
   * @return {string}
   */
  get country(): string {
    return this._country;
  }

  /**
   * Setter for _country. Sets an error if trying to set after
   *  initialization.
   * @param {string} country
   */
  set country(country: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._country = country;
    }
  }

  /**
   * Getter for experience
   * @return {string}
   */
  get experience(): string {
    return this._experience;
  }

  /**
   * Setter for _experience. Sets an error if trying to set after
   *  initialization.
   * @param {string} experience
   */
  set experience(experience: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._experience = experience;
    }
  }

  /**
   * Getter for familiar_name
   * @return {string}
   */
  get familiar_name(): string {
    return this._familiar_name;
  }

  /**
   * Setter for _familiar_name. Sets an error if trying to set after
   *  initialization.
   * @param {string} familiar_name
   */
  set familiar_name(familiar_name: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._familiar_name = familiar_name;
    }
  }

  /**
   * Getter for instructor_name
   * @return {string}
   */
  get instructor_name(): string {
    return this._instructor_name;
  }

  /**
   * Setter for _instructor_name. Sets an error if trying to set after
   *  initialization.
   * @param {string} instructor_name
   */
  set instructor_name(instructor_name: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._instructor_name = instructor_name;
    }
  }

  /**
   * Getter for title
   * @return {string}
   */
  get title(): string {
    return this._title;
  }

  /**
   * Setter for _title. Sets an error if trying to set after
   *  initialization.
   * @param {string} title
   */
  set title(title: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._title = title;
    }
  }

  /**
   * Getter for native_language
   * @return {string}
   */
  get native_language(): string {
    return this._native_language;
  }

  /**
   * Setter for _native_language. Sets an error if trying to set after
   *  initialization.
   * @param {string} native_language
   */
  set native_language(native_language: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._native_language = native_language;
    }
  }

  /**
   * Getter for state
   * @return {string}
   */
  get state(): string {
    return this._state;
  }

  /**
   * Setter for _state. Sets an error if trying to set after
   *  initialization.
   * @param {string} state
   */
  set state(state: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._state = state;
    }
  }

  /**
   * Getter for street_address
   * @return {string}
   */
  get street_address(): string {
    return this._street_address;
  }

  /**
   * Setter for _street_address. Sets an error if trying to set after
   *  initialization.
   * @param {string} street_address
   */
  set street_address(street_address: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._street_address = street_address;
    }
  }

  /**
   * Getter for telephone
   * @return {string}
   */
  get telephone(): string {
    return this._telephone;
  }

  /**
   * Setter for _telephone. Sets an error if trying to set after
   *  initialization.
   * @param {string} telephone
   */
  set telephone(telephone: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._telephone = telephone;
    }
  }

  /**
   * Getter for years_experience
   * @return {string}
   */
  get years_experience(): string {
    return this._years_experience;
  }

  /**
   * Setter for _years_experience. Sets an error if trying to set after
   *  initialization.
   * @param {string} years_experience
   */
  set years_experience(years_experience: string) {
    if (this.initialized) {
      throw new AICCValidationError(scorm12_errors.READ_ONLY_ELEMENT as number);
    } else {
      this._years_experience = years_experience;
    }
  }

  /**
   * toJSON for cmi.student_demographics object
   * @return {
   *      {
   *        city: string,
   *        class: string,
   *        company: string,
   *        country: string,
   *        experience: string,
   *        familiar_name: string,
   *        instructor_name: string,
   *        title: string,
   *        native_language: string,
   *        state: string,
   *        street_address: string,
   *        telephone: string,
   *        years_experience: string
   *      }
   *    }
   */
  toJSON(): {
    city: string;
    class: string;
    company: string;
    country: string;
    experience: string;
    familiar_name: string;
    instructor_name: string;
    title: string;
    native_language: string;
    state: string;
    street_address: string;
    telephone: string;
    years_experience: string;
  } {
    this.jsonString = true;
    const result = {
      city: this.city,
      class: this.class,
      company: this.company,
      country: this.country,
      experience: this.experience,
      familiar_name: this.familiar_name,
      instructor_name: this.instructor_name,
      title: this.title,
      native_language: this.native_language,
      state: this.state,
      street_address: this.street_address,
      telephone: this.telephone,
      years_experience: this.years_experience,
    };
    delete this.jsonString;
    return result;
  }
}
