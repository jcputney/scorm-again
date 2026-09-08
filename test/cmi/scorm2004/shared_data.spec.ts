import { beforeEach, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../../src/Scorm2004API";
import { LogLevelEnum, scorm2004_errors } from "../../../src/constants";

const TARGET = "com.scorm.golfsamples.sequencing.forcedsequential.notesStorage";
const SECOND_TARGET = "com.scorm.golfsamples.sequencing.forcedsequential.secondStorage";
const READ_ONLY_TARGET = "com.scorm.golfsamples.sequencing.forcedsequential.readOnlyStorage";
const UNMAPPED_TARGET = "com.scorm.golfsamples.sequencing.forcedsequential.unmappedStorage";
const UNINITIALIZED_TARGET =
  "com.scorm.golfsamples.sequencing.forcedsequential.uninitializedStorage";

const settings = () => ({
  logLevel: LogLevelEnum.NONE,
  sequencing: {
    activityTree: {
      id: "course",
      title: "Course",
      children: [
        {
          id: "first",
          title: "First",
          sharedDataMaps: [{ targetID: TARGET, readSharedData: true, writeSharedData: true }],
        },
        {
          id: "second",
          title: "Second",
          sharedDataMaps: [{ targetID: TARGET, readSharedData: true, writeSharedData: true }],
        },
      ],
    },
  },
});

const distinctActivitySettings = () => ({
  logLevel: LogLevelEnum.NONE,
  sequencing: {
    activityTree: {
      id: "course",
      title: "Course",
      sequencingControls: { flow: true },
      children: [
        {
          id: "first",
          title: "First",
          sharedDataMaps: [{ targetID: TARGET, readSharedData: true, writeSharedData: true }],
        },
        {
          id: "second",
          title: "Second",
          sharedDataMaps: [
            { targetID: SECOND_TARGET, readSharedData: true, writeSharedData: true },
          ],
        },
      ],
    },
  },
});

describe("SCORM 2004 shared data", () => {
  let api: Scorm2004API;

  beforeEach(() => {
    api = new Scorm2004API(settings());
    api.lmsInitialize();
  });

  it("keeps a missing bucket uninitialized and preserves values across a mapped view change", () => {
    expect(api.lmsGetValue("adl.data._count")).toBe("1");
    expect(api.lmsGetValue("adl.data.0.id")).toBe(TARGET);
    expect(api.lmsGetLastError()).toBe("0");
    expect(api.lmsGetValue("adl.data.0.store")).toBe("");
    expect(api.lmsGetLastError()).toBe(String(scorm2004_errors.VALUE_NOT_INITIALIZED));

    expect(api.lmsSetValue("adl.data.0.store", "")).toBe("true");
    expect(api.lmsGetValue("adl.data.0.store")).toBe("");
    expect(api.lmsGetLastError()).toBe("0");
    expect(api.captureSharedDataSnapshot()).toEqual({ [TARGET]: "" });

    expect(api.lmsSetValue("adl.data.0.store", "notes")).toBe("true");
    expect(api.captureSharedDataSnapshot()).toEqual({ [TARGET]: "notes" });

    api.adl.configureSharedDataMaps([
      { targetID: TARGET, readSharedData: true, writeSharedData: true },
    ]);
    expect(api.lmsGetValue("adl.data.0.store")).toBe("notes");
  });

  it("enforces read and write map flags with SCORM 2004 errors", () => {
    api.adl.configureSharedDataMaps([
      { targetID: TARGET, readSharedData: false, writeSharedData: true },
    ]);
    expect(api.lmsGetValue("adl.data.0.store")).toBe("");
    expect(api.lmsGetLastError()).toBe(String(scorm2004_errors.WRITE_ONLY_ELEMENT));
    expect(api.lmsSetValue("adl.data.0.store", "write-only")).toBe("true");

    api.adl.configureSharedDataMaps([
      { targetID: TARGET, readSharedData: true, writeSharedData: false },
    ]);
    expect(api.lmsGetValue("adl.data.0.store")).toBe("write-only");
    expect(api.lmsSetValue("adl.data.0.store", "blocked")).toBe("false");
    expect(api.lmsGetLastError()).toBe(String(scorm2004_errors.READ_ONLY_ELEMENT));
  });

  it("projects ADL data and all shared stores into commits and state snapshots", () => {
    api.lmsSetValue("adl.data.0.store", "persisted");
    const commit = api.renderCommitObject(false);
    expect((commit.runtimeData.adl as any).data["0"].store).toBe("persisted");
    expect(commit.sharedData).toEqual({ [TARGET]: "persisted" });

    const state = JSON.parse(api.serializeSequencingState());
    expect(state.sharedData).toEqual({ [TARGET]: "persisted" });

    const restored = new Scorm2004API(settings());
    restored.restoreSharedDataSnapshot({ [TARGET]: "restored" });
    restored.lmsInitialize();
    expect(restored.lmsGetValue("adl.data.0.store")).toBe("restored");
  });

  it("includes mapped shared data in the default compact commit payload", () => {
    const processHttpRequest = vi.fn(() => ({ result: "true", errorCode: 0 }));
    const compactApi = new Scorm2004API({ ...settings(), lmsCommitUrl: "/commit" }, {
      processHttpRequest,
    } as any);
    compactApi.lmsInitialize();
    compactApi.lmsSetValue("adl.data.0.store", "compact-payload");

    expect(compactApi.lmsCommit()).toBe("true");
    expect(processHttpRequest).toHaveBeenCalledOnce();
    expect(processHttpRequest.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({ sharedData: { [TARGET]: "compact-payload" } }),
    );
  });

  it("filters structured shared data to initialized writable mappings", () => {
    api.adl.configureSharedDataMaps([
      { targetID: TARGET, readSharedData: true, writeSharedData: true },
      { targetID: READ_ONLY_TARGET, readSharedData: true, writeSharedData: false },
      { targetID: UNINITIALIZED_TARGET, readSharedData: true, writeSharedData: true },
    ]);
    api.restoreSharedDataSnapshot({
      [TARGET]: "writable",
      [READ_ONLY_TARGET]: "read-only",
      [UNMAPPED_TARGET]: "unmapped",
    });

    expect(api.captureSharedDataSnapshot()).toEqual({
      [TARGET]: "writable",
      [READ_ONLY_TARGET]: "read-only",
      [UNMAPPED_TARGET]: "unmapped",
    });
    expect(api.renderCommitObject(false).sharedData).toEqual({ [TARGET]: "writable" });
  });

  it("filters compact JSON shared data to initialized writable mappings", () => {
    const processHttpRequest = vi.fn(() => ({ result: "true", errorCode: 0 }));
    const compactApi = new Scorm2004API({ ...settings(), lmsCommitUrl: "/commit" }, {
      processHttpRequest,
    } as any);
    compactApi.lmsInitialize();
    compactApi.adl.configureSharedDataMaps([
      { targetID: TARGET, readSharedData: true, writeSharedData: true },
      { targetID: READ_ONLY_TARGET, readSharedData: true, writeSharedData: false },
      { targetID: UNINITIALIZED_TARGET, readSharedData: true, writeSharedData: true },
    ]);
    compactApi.restoreSharedDataSnapshot({
      [TARGET]: "writable",
      [READ_ONLY_TARGET]: "read-only",
      [UNMAPPED_TARGET]: "unmapped",
    });

    expect(compactApi.lmsCommit()).toBe("true");
    expect(processHttpRequest.mock.calls[0]?.[1]).toEqual(
      expect.objectContaining({ sharedData: { [TARGET]: "writable" } }),
    );
  });

  it("treats a restored snapshot as authoritative", () => {
    api.restoreSharedDataSnapshot({ [TARGET]: "stale", unrelated: "remove me" });
    api.restoreSharedDataSnapshot({});

    expect(api.lmsGetValue("adl.data.0.store")).toBe("");
    expect(api.lmsGetLastError()).toBe(String(scorm2004_errors.VALUE_NOT_INITIALIZED));
    expect(api.captureSharedDataSnapshot()).toEqual({});
  });

  it("rebuilds mapped buckets as uninitialized while preserving stores across API reset", () => {
    expect(api.lmsSetValue("adl.data.0.store", "survives reset")).toBe("true");

    api.reset();

    expect(api.adl.data.initialized).toBe(false);
    expect(api.adl.data.childArray[0].initialized).toBe(false);
    expect(api.lmsInitialize()).toBe("true");
    expect(api.lmsGetValue("adl.data.0.store")).toBe("survives reset");
  });

  it("does not add empty shared-data fields when no mappings or stores are used", () => {
    const noSharedDataApi = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    noSharedDataApi.lmsInitialize();

    const commit = noSharedDataApi.renderCommitObject(false);
    expect(commit.runtimeData.adl).toBeUndefined();
    expect(commit.sharedData).toBeUndefined();
  });

  it("rebinds ADL data mappings to the restored activity before Initialize", () => {
    const source = new Scorm2004API(distinctActivitySettings());
    source.lmsInitialize();
    source.lmsSetValue("adl.data.0.store", "first-value");
    source.lmsSetValue("adl.nav.request", "continue");
    source.lmsFinish();

    const restored = new Scorm2004API(distinctActivitySettings());
    expect(restored.deserializeSequencingState(source.serializeSequencingState())).toBe(true);
    expect(restored.adl.data.childArray[0].id).toBe(SECOND_TARGET);
    expect(restored.lmsInitialize()).toBe("true");
    expect(restored.lmsGetValue("adl.data.0.store")).toBe("");
    expect(restored.lmsGetLastError()).toBe(String(scorm2004_errors.VALUE_NOT_INITIALIZED));
  });

  it("rebinds ADL data mappings after an asynchronous auto-load", async () => {
    const source = new Scorm2004API(distinctActivitySettings());
    source.lmsInitialize();
    source.lmsSetValue("adl.data.0.store", "first-value");
    source.lmsSetValue("adl.nav.request", "continue");
    source.lmsFinish();
    const state = source.serializeSequencingState();

    let resolveLoad: ((value: string) => void) | undefined;
    const loadState = new Promise<string>((resolve) => {
      resolveLoad = resolve;
    });
    const restored = new Scorm2004API({
      ...distinctActivitySettings(),
      sequencingStatePersistence: {
        persistence: {
          saveState: async () => true,
          loadState: async () => loadState,
        },
        compress: false,
      },
    });

    expect(restored.lmsInitialize()).toBe("true");
    expect(restored.adl.data.childArray[0].id).toBe(TARGET);
    resolveLoad?.(state);

    await vi.waitFor(() => expect(restored.adl.data.childArray[0].id).toBe(SECOND_TARGET));
  });

  it("exposes the delivered activity's mappings to generic ActivityDelivery listeners", () => {
    const delivered: Array<{ activityId: string; mappedTarget: string }> = [];
    const observed = new Scorm2004API(distinctActivitySettings());
    observed.on("ActivityDelivery", (activityId) => {
      delivered.push({
        activityId: String(activityId),
        mappedTarget: observed.adl.data.childArray[0]?.id ?? "",
      });
    });

    expect(observed.lmsInitialize()).toBe("true");
    expect(observed.lmsSetValue("adl.nav.request", "continue")).toBe("true");
    expect(observed.lmsFinish()).toBe("true");

    expect(delivered).toEqual([
      { activityId: "first", mappedTarget: TARGET },
      { activityId: "second", mappedTarget: SECOND_TARGET },
    ]);
  });
});
