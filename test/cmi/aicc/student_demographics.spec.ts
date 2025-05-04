import { describe, it, expect, beforeEach } from "vitest";
import { CMIStudentDemographics } from "../../../src/cmi/aicc/student_demographics";
import { AICCValidationError } from "../../../src/exceptions/aicc_exceptions";

describe("AICC CMIStudentDemographics", () => {
  let demographics: CMIStudentDemographics;

  beforeEach(() => {
    demographics = new CMIStudentDemographics();
  });

  it("should set and get city", () => {
    demographics.city = "Boulder";
    expect(demographics.city).toBe("Boulder");
  });

  it("should set and get class", () => {
    demographics.class = "Math 101";
    expect(demographics.class).toBe("Math 101");
  });

  it("should set and get company", () => {
    demographics.company = "ACME Corp";
    expect(demographics.company).toBe("ACME Corp");
  });

  it("should set and get country", () => {
    demographics.country = "USA";
    expect(demographics.country).toBe("USA");
  });

  it("should set and get experience", () => {
    demographics.experience = "Beginner";
    expect(demographics.experience).toBe("Beginner");
  });

  it("should set and get familiar_name", () => {
    demographics.familiar_name = "John";
    expect(demographics.familiar_name).toBe("John");
  });

  it("should set and get instructor_name", () => {
    demographics.instructor_name = "Dr. Smith";
    expect(demographics.instructor_name).toBe("Dr. Smith");
  });

  it("should set and get title", () => {
    demographics.title = "Student";
    expect(demographics.title).toBe("Student");
  });

  it("should set and get native_language", () => {
    demographics.native_language = "English";
    expect(demographics.native_language).toBe("English");
  });

  it("should set and get state", () => {
    demographics.state = "Colorado";
    expect(demographics.state).toBe("Colorado");
  });

  it("should set and get street_address", () => {
    demographics.street_address = "123 Main St";
    expect(demographics.street_address).toBe("123 Main St");
  });

  it("should set and get telephone", () => {
    demographics.telephone = "555-1234";
    expect(demographics.telephone).toBe("555-1234");
  });

  it("should set and get years_experience", () => {
    demographics.years_experience = "5";
    expect(demographics.years_experience).toBe("5");
  });

  it("should not allow setting properties after initialization", () => {
    demographics.initialize();
    
    expect(() => { demographics.city = "Denver"; }).toThrow(AICCValidationError);
    expect(() => { demographics.class = "Science 101"; }).toThrow(AICCValidationError);
    expect(() => { demographics.company = "Umbrella Corp"; }).toThrow(AICCValidationError);
    expect(() => { demographics.country = "Canada"; }).toThrow(AICCValidationError);
    expect(() => { demographics.experience = "Advanced"; }).toThrow(AICCValidationError);
    expect(() => { demographics.familiar_name = "Johnny"; }).toThrow(AICCValidationError);
    expect(() => { demographics.instructor_name = "Dr. Jones"; }).toThrow(AICCValidationError);
    expect(() => { demographics.title = "Graduate"; }).toThrow(AICCValidationError);
    expect(() => { demographics.native_language = "Spanish"; }).toThrow(AICCValidationError);
    expect(() => { demographics.state = "Utah"; }).toThrow(AICCValidationError);
    expect(() => { demographics.street_address = "456 Oak St"; }).toThrow(AICCValidationError);
    expect(() => { demographics.telephone = "555-5678"; }).toThrow(AICCValidationError);
    expect(() => { demographics.years_experience = "10"; }).toThrow(AICCValidationError);
  });

  it("should return _children property", () => {
    expect(demographics._children).toBe("city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience");
  });

  it("should reset properly", () => {
    demographics.initialize();
    expect(demographics.initialized).toBe(true);
    
    demographics.reset();
    expect(demographics.initialized).toBe(false);
  });

  it("should convert to JSON correctly", () => {
    demographics.city = "Boulder";
    demographics.class = "Math 101";
    demographics.company = "ACME Corp";
    demographics.country = "USA";
    demographics.experience = "Beginner";
    demographics.familiar_name = "John";
    demographics.instructor_name = "Dr. Smith";
    demographics.title = "Student";
    demographics.native_language = "English";
    demographics.state = "Colorado";
    demographics.street_address = "123 Main St";
    demographics.telephone = "555-1234";
    demographics.years_experience = "5";

    const json = demographics.toJSON();
    
    expect(json.city).toBe("Boulder");
    expect(json.class).toBe("Math 101");
    expect(json.company).toBe("ACME Corp");
    expect(json.country).toBe("USA");
    expect(json.experience).toBe("Beginner");
    expect(json.familiar_name).toBe("John");
    expect(json.instructor_name).toBe("Dr. Smith");
    expect(json.title).toBe("Student");
    expect(json.native_language).toBe("English");
    expect(json.state).toBe("Colorado");
    expect(json.street_address).toBe("123 Main St");
    expect(json.telephone).toBe("555-1234");
    expect(json.years_experience).toBe("5");
  });
}); 