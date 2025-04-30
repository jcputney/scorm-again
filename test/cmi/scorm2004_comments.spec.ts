import { describe, it, vi } from "vitest";
import {
  CMICommentsFromLearner,
  CMICommentsFromLMS,
  CMICommentsObject,
} from "../../src/cmi/scorm2004/comments";
import { scorm2004_constants } from "../../src/constants/api_constants";

describe("SCORM 2004 Comments Tests", () => {
  describe("CMICommentsFromLearner Tests", () => {
    describe("Initialization Tests", () => {
      it("should initialize with default values", () => {
        const comments = new CMICommentsFromLearner();

        expect(comments.childArray.length).toBe(0);
      });

      it("should have read-only _children property", () => {
        const comments = new CMICommentsFromLearner();

        expect(comments["_children"]).toBe(scorm2004_constants.comments_children);

        expect(() => {
          // @ts-ignore - Testing invalid assignment
          comments["_children"] = "invalid";
        }).toThrow();
      });
    });

    describe("Array Operations", () => {
      it("should add and retrieve comment objects", () => {
        const comments = new CMICommentsFromLearner();

        // Add a comment
        const commentObj = new CMICommentsObject();
        commentObj.comment = "This is a test comment";
        commentObj.location = "Test Location";
        commentObj.timestamp = "2023-01-01T12:00:00.000Z";

        comments.childArray.push(commentObj);

        expect(comments.childArray.length).toBe(1);
        expect(comments.childArray[0].comment).toBe("This is a test comment");
        expect(comments.childArray[0].location).toBe("Test Location");
        expect(comments.childArray[0].timestamp).toBe("2023-01-01T12:00:00.000Z");
      });
    });

    describe("JSON Serialization", () => {
      it("should serialize to JSON correctly", () => {
        const comments = new CMICommentsFromLearner();

        // Add a comment
        const commentObj = new CMICommentsObject();
        commentObj.comment = "This is a test comment";
        commentObj.location = "Test Location";
        commentObj.timestamp = "2023-01-01T12:00:00.000Z";

        comments.childArray.push(commentObj);

        const json = JSON.stringify(comments);
        const parsed = JSON.parse(json);

        expect(parsed["0"]).not.toBeNull();
        expect(parsed["0"].comment).toBe("This is a test comment");
        expect(parsed["0"].location).toBe("Test Location");
        expect(parsed["0"].timestamp).toBe("2023-01-01T12:00:00.000Z");
      });
    });
  });

  describe("CMICommentsFromLMS Tests", () => {
    describe("Initialization Tests", () => {
      it("should initialize with default values", () => {
        const comments = new CMICommentsFromLMS();

        expect(comments.childArray.length).toBe(0);
      });

      it("should have read-only _children property", () => {
        const comments = new CMICommentsFromLMS();

        expect(comments["_children"]).toBe(scorm2004_constants.comments_children);

        expect(() => {
          // @ts-ignore - Testing invalid assignment
          comments["_children"] = "invalid";
        }).toThrow();
      });
    });

    describe("Array Operations", () => {
      it("should add and retrieve comment objects", () => {
        const comments = new CMICommentsFromLMS();

        // Add a comment
        const commentObj = new CMICommentsObject(true); // readOnlyAfterInit = true
        commentObj.comment = "This is a test comment from LMS";
        commentObj.location = "Test Location";
        commentObj.timestamp = "2023-01-01T12:00:00.000Z";

        comments.childArray.push(commentObj);

        expect(comments.childArray.length).toBe(1);
        expect(comments.childArray[0].comment).toBe("This is a test comment from LMS");
        expect(comments.childArray[0].location).toBe("Test Location");
        expect(comments.childArray[0].timestamp).toBe("2023-01-01T12:00:00.000Z");
      });
    });

    describe("JSON Serialization", () => {
      it("should serialize to JSON correctly", () => {
        const comments = new CMICommentsFromLMS();

        // Add a comment
        const commentObj = new CMICommentsObject(true); // readOnlyAfterInit = true
        commentObj.comment = "This is a test comment from LMS";
        commentObj.location = "Test Location";
        commentObj.timestamp = "2023-01-01T12:00:00.000Z";

        comments.childArray.push(commentObj);

        const json = JSON.stringify(comments);
        const parsed = JSON.parse(json);

        expect(parsed["0"]).not.toBeNull();
        expect(parsed["0"].comment).toBe("This is a test comment from LMS");
        expect(parsed["0"].location).toBe("Test Location");
        expect(parsed["0"].timestamp).toBe("2023-01-01T12:00:00.000Z");
      });
    });
  });

  describe("CMICommentsObject Tests", () => {
    describe("Initialization Tests", () => {
      it("should initialize with default values", () => {
        const commentObj = new CMICommentsObject();

        expect(commentObj.comment).toBe("");
        expect(commentObj.location).toBe("");
        expect(commentObj.timestamp).toBe("");
      });
    });

    describe("Property Tests", () => {
      describe("comment", () => {
        it("should set and get comment", () => {
          const commentObj = new CMICommentsObject();

          commentObj.comment = "This is a test comment";
          expect(commentObj.comment).toBe("This is a test comment");

          commentObj.comment = "Another comment";
          expect(commentObj.comment).toBe("Another comment");
        });

        it("should reject invalid comment values", () => {
          const commentObj = new CMICommentsObject();

          // Create a string that's too long (more than 4000 characters)
          const tooLongComment = "a".repeat(4001);

          expect(() => {
            commentObj.comment = tooLongComment;
          }).toThrow();
        });

        it("should reject modifications after initialization when readOnlyAfterInit is true", () => {
          const commentObj = new CMICommentsObject(true); // readOnlyAfterInit = true

          commentObj.comment = "Initial comment";
          commentObj.initialize();

          expect(() => {
            commentObj.comment = "Modified comment";
          }).toThrow();
        });
      });

      describe("location", () => {
        it("should set and get location", () => {
          const commentObj = new CMICommentsObject();

          commentObj.location = "Test Location";
          expect(commentObj.location).toBe("Test Location");

          commentObj.location = "Another Location";
          expect(commentObj.location).toBe("Another Location");
        });

        it("should reject invalid location values", () => {
          const commentObj = new CMICommentsObject();

          // Create a string that's too long (more than 250 characters)
          const tooLongLocation = "a".repeat(251);

          expect(() => {
            commentObj.location = tooLongLocation;
          }).toThrow();
        });

        it("should reject modifications after initialization when readOnlyAfterInit is true", () => {
          const commentObj = new CMICommentsObject(true); // readOnlyAfterInit = true

          commentObj.location = "Initial location";
          commentObj.initialize();

          expect(() => {
            commentObj.location = "Modified location";
          }).toThrow();
        });
      });

      describe("timestamp", () => {
        it("should set and get timestamp", () => {
          const commentObj = new CMICommentsObject();

          commentObj.timestamp = "2023-01-01T12:00:00.000Z";
          expect(commentObj.timestamp).toBe("2023-01-01T12:00:00.000Z");

          commentObj.timestamp = "2023-02-01T14:30:00.000Z";
          expect(commentObj.timestamp).toBe("2023-02-01T14:30:00.000Z");
        });

        it("should reject invalid timestamp values", () => {
          const commentObj = new CMICommentsObject();

          expect(() => {
            commentObj.timestamp = "invalid-timestamp";
          }).toThrow();
        });

        it("should reject modifications after initialization when readOnlyAfterInit is true", () => {
          const commentObj = new CMICommentsObject(true); // readOnlyAfterInit = true

          commentObj.timestamp = "2023-01-01T12:00:00.000Z";
          commentObj.initialize();

          expect(() => {
            commentObj.timestamp = "2023-02-01T14:30:00.000Z";
          }).toThrow();
        });
      });
    });

    describe("JSON Serialization", () => {
      it("should serialize to JSON correctly", () => {
        const commentObj = new CMICommentsObject();

        commentObj.comment = "This is a test comment";
        commentObj.location = "Test Location";
        commentObj.timestamp = "2023-01-01T12:00:00.000Z";

        const json = JSON.stringify(commentObj);
        const parsed = JSON.parse(json);

        expect(parsed.comment).toBe("This is a test comment");
        expect(parsed.location).toBe("Test Location");
        expect(parsed.timestamp).toBe("2023-01-01T12:00:00.000Z");
      });
    });
  });
});
