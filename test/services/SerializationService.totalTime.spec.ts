import { describe, expect, it, vi } from "vitest";
import { SerializationService } from "../../src/services/SerializationService";
import { LogLevelEnum } from "../../src/constants/enums";
import { CommitObject } from "../../src/types/api_types";

describe("SerializationService - Total Time Calculation", () => {
  it("should treat alwaysSendTotalTime as a flag to include total time in commit data", () => {
    // Arrange
    const serializationService = new SerializationService();
    const terminateCommit = false;
    const alwaysSendTotalTime = true;
    const renderCommonCommitFields = true;

    // Mock the renderCommitObject function to verify what it's called with
    const renderCommitObjectStub = vi.fn().mockReturnValue({
      successStatus: "unknown",
      completionStatus: "unknown",
      totalTimeSeconds: 0,
      runtimeData: {},
    } as CommitObject);

    const renderCommitCMIStub = vi.fn();
    const apiLogLevel = LogLevelEnum.ERROR;

    // Act
    serializationService.getCommitObject(
      terminateCommit,
      alwaysSendTotalTime,
      renderCommonCommitFields,
      renderCommitObjectStub,
      renderCommitCMIStub,
      apiLogLevel,
    );

    // Assert
    // Verify that renderCommitObject is called with (terminateCommit, includeTotalTime)
    // where terminateCommit is the actual value (false) and includeTotalTime is true
    // when alwaysSendTotalTime is true.
    expect(renderCommitObjectStub).toHaveBeenCalledOnce();
    expect(renderCommitObjectStub).toHaveBeenCalledWith(false, true);
    expect(renderCommitCMIStub).not.toHaveBeenCalled();
  });

  it("should separate the concerns of including total time and terminating the session", () => {
    // This test verifies that the implementation correctly separates
    // the concerns of including total time and terminating the session

    // Arrange
    const serializationService = new SerializationService();
    const terminateCommit = false;
    const alwaysSendTotalTime = true;
    const renderCommonCommitFields = true;

    // Create stubs to test the implementation:
    // renderCommitObject should be called with separate parameters for
    // terminateCommit and includeTotalTime
    const renderCommitObjectStub = vi.fn().mockImplementation(() => {
      // This function receives separate parameters for terminateCommit and includeTotalTime
      return {
        successStatus: "unknown",
        completionStatus: "unknown",
        totalTimeSeconds: 0,
        runtimeData: {},
      } as CommitObject;
    });

    const renderCommitCMIStub = vi.fn();
    const apiLogLevel = LogLevelEnum.ERROR;

    // Act
    serializationService.getCommitObject(
      terminateCommit,
      alwaysSendTotalTime,
      renderCommonCommitFields,
      renderCommitObjectStub,
      renderCommitCMIStub,
      apiLogLevel,
    );

    // Assert
    // Verify that renderCommitObject is called with the correct parameters:
    // - The actual terminateCommit value (false)
    // - A separate parameter for whether to include total time (true)
    expect(renderCommitObjectStub).toHaveBeenCalledOnce();

    // Verify the parameters passed to renderCommitObject
    expect(renderCommitObjectStub).toHaveBeenCalledWith(false, true);
  });
});
