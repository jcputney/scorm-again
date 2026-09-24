import { Activity, ActivityObjective } from "../activity";
import { ActivityTree } from "../activity_tree";
import { SequencingControls } from "../sequencing_controls";
import { RuleCondition, SequencingRule, SequencingRules } from "../sequencing_rules";
import { RollupCondition, RollupRule, RollupRules } from "../rollup_rules";

const modelPrototypes = new Set([
  Object.prototype,
  Activity.prototype,
  ActivityObjective.prototype,
  ActivityTree.prototype,
  SequencingControls.prototype,
  RuleCondition.prototype,
  SequencingRule.prototype,
  SequencingRules.prototype,
  RollupCondition.prototype,
  RollupRule.prototype,
  RollupRules.prototype,
]);

/**
 * Copy engine-owned data without invoking serialization, getters or constructors.
 * Persistence snapshots intentionally omit transient tracking/dirty flags; preview
 * needs those too. Keep cyclic parent/current pointers and model methods, but never
 * copy host callbacks or unfamiliar objects into the speculative engine.
 */
export function clonePreviewState<T>(value: T): T {
  const seen = new Map<object, any>();
  const copy = (item: any): any => {
    if (typeof item === "function") throw new Error("Preview cannot copy callbacks");
    if (item === null || typeof item !== "object") return item;
    if (seen.has(item)) return seen.get(item);
    const prototype = Object.getPrototypeOf(item);
    if (
      [Date.prototype, Map.prototype, Set.prototype].includes(prototype) &&
      Reflect.ownKeys(item).length > 0
    )
      throw new Error("Preview cannot copy custom collection properties");
    if (prototype === Date.prototype) return new Date(Date.prototype.getTime.call(item));
    if (prototype === Map.prototype) {
      const result = new Map();
      seen.set(item, result);
      for (const [key, entry] of Map.prototype.entries.call(item))
        result.set(copy(key), copy(entry));
      return result;
    }
    if (prototype === Set.prototype) {
      const result = new Set();
      seen.set(item, result);
      for (const entry of Set.prototype.values.call(item)) result.add(copy(entry));
      return result;
    }
    if (prototype !== null && prototype !== Array.prototype && !modelPrototypes.has(prototype)) {
      throw new Error("Preview cannot copy a custom model");
    }
    const result = Array.isArray(item) ? [] : Object.create(prototype);
    seen.set(item, result);
    for (const key of Reflect.ownKeys(item)) {
      const descriptor = Object.getOwnPropertyDescriptor(item, key)!;
      if (!("value" in descriptor)) throw new Error("Preview cannot copy accessors");
      Object.defineProperty(result, key, { ...descriptor, value: copy(descriptor.value) });
    }
    return result;
  };
  return copy(value);
}
