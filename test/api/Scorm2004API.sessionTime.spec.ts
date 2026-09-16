import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { CommitObject, Settings } from "../../src/types/api_types";

const createApi = (settings: Settings = {}) => {
  const api = new Scorm2004API({
    logLevel: LogLevelEnum.NONE,
    lmsCommitUrl: "/commit",
    renderCommonCommitFields: true,
    ...settings,
  });
  const commits: CommitObject[] = [];
  vi.spyOn(api, "processHttpRequest").mockImplementation((_url, payload) => {
    commits.push(structuredClone(payload) as CommitObject);
    return { result: "true", errorCode: 0 };
  });
  expect(api.Initialize("")).toBe("true");
  return { api, commits };
};

describe("SCORM 2004 session time after Terminate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("leaves total_time unchanged by default without doubling later commits", () => {
    const { api, commits } = createApi();
    vi.advanceTimersByTime(60_000);
    expect(api.SetValue("cmi.session_time", "PT1M")).toBe("true");

    expect(api.Terminate("")).toBe("true");
    expect(commits).toHaveLength(1);
    expect(commits[0]?.totalTimeSeconds).toBe(60);
    expect(api.cmi.total_time).toBe("PT0S");
    expect(api.renderCommitObject(true).totalTimeSeconds).toBe(commits[0]?.totalTimeSeconds);
  });

  it("accumulates when opted in without doubling repeated termination commits", () => {
    const { api, commits } = createApi({
      accumulateSessionTimeOnTerminate: true,
      selfReportSessionTime: true,
    });
    vi.advanceTimersByTime(60_000);

    expect(api.Terminate("")).toBe("true");
    expect(commits[0]?.totalTimeSeconds).toBe(60);
    expect(api.cmi.total_time).toBe("PT1M");
    expect(api.renderCommitObject(true).totalTimeSeconds).toBe(60);

    expect(api.terminate("Terminate", false)).toBe("true");
    expect(commits).toHaveLength(2);
    expect(commits[1]?.totalTimeSeconds).toBe(60);

    api.cmi.accumulateSessionTime();
    expect(api.cmi.total_time).toBe("PT1M");
    vi.advanceTimersByTime(250);
    expect(api.renderCommitObject(true).totalTimeSeconds).toBe(60.25);
  });

  it("clears self-reported session time without starting an elapsed-time clock", () => {
    const { api, commits } = createApi({
      selfReportSessionTime: false,
      accumulateSessionTimeOnTerminate: true,
    });
    expect(api.SetValue("cmi.session_time", "PT1M")).toBe("true");

    expect(api.Terminate("")).toBe("true");
    expect(commits[0]?.totalTimeSeconds).toBe(60);
    expect(api.cmi.total_time).toBe("PT1M");
    expect(api.cmi.start_time).toBeUndefined();
    vi.advanceTimersByTime(60_000);
    expect(api.renderCommitObject(true).totalTimeSeconds).toBe(60);
  });

  it("accumulates automatically when sequencing is active", () => {
    const { api, commits } = createApi({
      selfReportSessionTime: true,
      sequencing: {
        activityTree: {
          id: "root",
          title: "Course",
          children: [{ id: "sco", title: "SCO" }],
        },
      },
    });
    expect(api.getSequencingState().isInitialized).toBe(true);
    vi.advanceTimersByTime(60_000);

    expect(api.Terminate("")).toBe("true");
    expect(commits[0]?.totalTimeSeconds).toBe(60);
    expect(api.cmi.total_time).toBe("PT1M");
    expect(api.renderCommitObject(true).totalTimeSeconds).toBe(60);
  });
});
