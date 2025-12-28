/**
 * Helper functions for parsing SCORM 2004 manifest XML files
 * and building activity tree configurations for scorm-again
 */

import { readFileSync } from "fs";
import { DOMParser } from "@xmldom/xmldom";

export interface ParsedManifest {
  activityTree: ActivityTreeConfig;
  sequencingRules?: Record<string, SequencingRulesConfig>;
  sequencingControls?: SequencingControlsConfig;
  rollupRules?: Record<string, RollupRulesConfig>;
  objectives?: Record<string, ObjectiveConfig[]>;
}

export interface ActivityTreeConfig {
  id: string;
  title: string;
  children?: ActivityTreeConfig[];
  identifierref?: string;
  sequencingRules?: SequencingRulesConfig;
  sequencingControls?: SequencingControlsConfig;
  rollupRules?: RollupRulesConfig;
  objectives?: ObjectiveConfig[];
  sequencingCollectionRefs?: string | string[];
}

export interface SequencingRulesConfig {
  preConditionRules?: SequencingRuleConfig[];
  exitConditionRules?: SequencingRuleConfig[];
  postConditionRules?: SequencingRuleConfig[];
}

export interface SequencingRuleConfig {
  action: string;
  conditionCombination?: "all" | "any";
  conditions: RuleConditionConfig[];
}

export interface RuleConditionConfig {
  condition: string;
  operator?: "not" | "noOp";
  referencedObjective?: string;
}

export interface SequencingControlsConfig {
  choice?: boolean;
  choiceExit?: boolean;
  flow?: boolean;
  forwardOnly?: boolean;
  useCurrentAttemptObjectiveInfo?: boolean;
  useCurrentAttemptProgressInfo?: boolean;
}

export interface RollupRulesConfig {
  objectiveMeasureWeight?: number;
  rollupRules?: RollupRuleConfig[];
}

export interface RollupRuleConfig {
  childActivitySet: string;
  conditionCombination?: "all" | "any";
  conditions: RollupConditionConfig[];
  action: string;
}

export interface RollupConditionConfig {
  condition: string;
}

export interface ObjectiveConfig {
  objectiveID: string;
  isPrimary?: boolean;
  mapInfo?: ObjectiveMapInfoConfig[];
}

export interface ObjectiveMapInfoConfig {
  targetObjectiveID: string;
  readSatisfiedStatus?: boolean;
  writeSatisfiedStatus?: boolean;
  readNormalizedMeasure?: boolean;
  writeNormalizedMeasure?: boolean;
  readCompletionStatus?: boolean;
  writeCompletionStatus?: boolean;
  readProgressMeasure?: boolean;
  writeProgressMeasure?: boolean;
}

/**
 * Parse a SCORM 2004 manifest XML file and extract sequencing configuration
 */
export function parseManifest(manifestPath: string): ParsedManifest {
  const manifestContent = readFileSync(manifestPath, "utf-8");
  const parser = new DOMParser();
  const doc = parser.parseFromString(manifestContent, "text/xml");

  // Find the default organization
  const organizations = doc.getElementsByTagName("organizations");
  if (organizations.length === 0) {
    throw new Error("No organizations found in manifest");
  }

  const orgsElement = organizations[0];
  const defaultOrg = orgsElement.getAttribute("default");
  if (!defaultOrg) {
    throw new Error("No default organization specified");
  }

  // Find the organization element
  const orgElements = doc.getElementsByTagName("organization");
  let orgElement: Element | null = null;
  for (let i = 0; i < orgElements.length; i++) {
    if (orgElements[i].getAttribute("identifier") === defaultOrg) {
      orgElement = orgElements[i];
      break;
    }
  }

  if (!orgElement) {
    throw new Error(`Organization ${defaultOrg} not found`);
  }

  // Parse sequencing collections (reusable sequencing rules)
  const sequencingCollections = parseSequencingCollections(doc);

  // Parse the activity tree
  const activityTree = parseActivityTree(orgElement, sequencingCollections);

  // Parse organization-level sequencing controls
  const orgSequencing = orgElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "sequencing"
  );
  let sequencingControls: SequencingControlsConfig | undefined;
  if (orgSequencing.length > 0) {
    sequencingControls = parseSequencingControls(orgSequencing[0]);
  }

  return {
    activityTree,
    sequencingControls
  };
}

/**
 * Parse sequencing collections from manifest
 */
function parseSequencingCollections(
  doc: Document
): Map<string, SequencingRulesConfig & RollupRulesConfig> {
  const collections = new Map<
    string,
    SequencingRulesConfig & RollupRulesConfig
  >();

  const collectionElements = doc.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "sequencingCollection"
  );
  if (collectionElements.length === 0) {
    return collections;
  }

  const collection = collectionElements[0];
  const sequencingElements = collection.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "sequencing"
  );

  for (let i = 0; i < sequencingElements.length; i++) {
    const seqElement = sequencingElements[i];
    const id = seqElement.getAttribute("ID");
    if (!id) continue;

    const config: SequencingRulesConfig & RollupRulesConfig = {};

    // Parse rollup rules
    const rollupRules = seqElement.getElementsByTagNameNS(
      "http://www.imsglobal.org/xsd/imsss",
      "rollupRules"
    );
    if (rollupRules.length > 0) {
      config.objectiveMeasureWeight = parseFloat(
        rollupRules[0].getAttribute("objectiveMeasureWeight") || "0"
      );
    }

    collections.set(id, config);
  }

  return collections;
}

/**
 * Parse activity tree from organization element
 */
function parseActivityTree(
  orgElement: Element,
  collections: Map<string, SequencingRulesConfig & RollupRulesConfig>
): ActivityTreeConfig {
  const id = orgElement.getAttribute("identifier") || "";
  const titleElement = orgElement.getElementsByTagName("title")[0];
  const title = titleElement ? titleElement.textContent?.trim() || "" : "";

  const children: ActivityTreeConfig[] = [];
  const items = orgElement.getElementsByTagName("item");

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    children.push(parseActivityItem(item, collections));
  }

  return {
    id,
    title,
    children
  };
}

/**
 * Parse an activity item (recursive)
 */
function parseActivityItem(
  itemElement: Element,
  collections: Map<string, SequencingRulesConfig & RollupRulesConfig>
): ActivityTreeConfig {
  const id = itemElement.getAttribute("identifier") || "";
  const identifierref = itemElement.getAttribute("identifierref") || undefined;
  const titleElement = itemElement.getElementsByTagName("title")[0];
  const title = titleElement ? titleElement.textContent?.trim() || "" : "";

  const children: ActivityTreeConfig[] = [];
  const childItems = itemElement.getElementsByTagName("item");
  for (let i = 0; i < childItems.length; i++) {
    const childItem = childItems[i];
    // Only process direct children (not nested deeper)
    if (childItem.parentNode === itemElement) {
      children.push(parseActivityItem(childItem, collections));
    }
  }

  // Parse sequencing configuration
  const sequencingElement = itemElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "sequencing"
  )[0];

  let sequencingRules: SequencingRulesConfig | undefined;
  let rollupRules: RollupRulesConfig | undefined;
  let objectives: ObjectiveConfig[] | undefined;
  let sequencingCollectionRefs: string | string[] | undefined;

  if (sequencingElement) {
    // Check for IDRef to sequencing collection
    const idRef = sequencingElement.getAttribute("IDRef");
    if (idRef) {
      sequencingCollectionRefs = idRef;
      const collection = collections.get(idRef);
      if (collection) {
        sequencingRules = {
          preConditionRules: collection.preConditionRules,
          exitConditionRules: collection.exitConditionRules,
          postConditionRules: collection.postConditionRules
        };
        rollupRules = {
          objectiveMeasureWeight: collection.objectiveMeasureWeight,
          rollupRules: collection.rollupRules
        };
      }
    }

    // Parse sequencing rules (may override collection)
    const rules = parseSequencingRules(sequencingElement);
    if (rules) {
      sequencingRules = { ...sequencingRules, ...rules };
    }

    // Parse rollup rules (may override collection)
    const itemRollupRules = parseRollupRules(sequencingElement);
    if (itemRollupRules) {
      rollupRules = { ...rollupRules, ...itemRollupRules };
    }

    // Parse objectives
    objectives = parseObjectives(sequencingElement);
  }

  return {
    id,
    title,
    identifierref,
    children: children.length > 0 ? children : undefined,
    sequencingRules,
    rollupRules,
    objectives,
    sequencingCollectionRefs
  };
}

/**
 * Parse sequencing rules from sequencing element
 */
function parseSequencingRules(
  sequencingElement: Element
): SequencingRulesConfig | undefined {
  const rulesElement = sequencingElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "sequencingRules"
  )[0];
  if (!rulesElement) return undefined;

  const config: SequencingRulesConfig = {};

  // Parse pre-condition rules
  const preRules = rulesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "preConditionRule"
  );
  if (preRules.length > 0) {
    config.preConditionRules = Array.from(preRules).map((rule) =>
      parseSequencingRule(rule)
    );
  }

  // Parse exit-condition rules
  const exitRules = rulesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "exitConditionRule"
  );
  if (exitRules.length > 0) {
    config.exitConditionRules = Array.from(exitRules).map((rule) =>
      parseSequencingRule(rule)
    );
  }

  // Parse post-condition rules
  const postRules = rulesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "postConditionRule"
  );
  if (postRules.length > 0) {
    config.postConditionRules = Array.from(postRules).map((rule) =>
      parseSequencingRule(rule)
    );
  }

  return Object.keys(config).length > 0 ? config : undefined;
}

/**
 * Parse a single sequencing rule
 */
function parseSequencingRule(ruleElement: Element): SequencingRuleConfig {
  const actionElement = ruleElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "ruleAction"
  )[0];
  const action = actionElement?.getAttribute("action") || "";

  const conditionsElement = ruleElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "ruleConditions"
  )[0];
  const conditionCombination =
    (conditionsElement?.getAttribute("conditionCombination") as
      | "all"
      | "any") || "all";

  const conditions: RuleConditionConfig[] = [];
  const conditionElements = conditionsElement?.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "ruleCondition"
  );
  if (conditionElements) {
    for (let i = 0; i < conditionElements.length; i++) {
      const cond = conditionElements[i];
      conditions.push({
        condition: cond.getAttribute("condition") || "",
        operator: (cond.getAttribute("operator") as "not" | "noOp") || "noOp",
        referencedObjective: cond.getAttribute("referencedObjective") || undefined
      });
    }
  }

  return {
    action,
    conditionCombination,
    conditions
  };
}

/**
 * Parse rollup rules
 */
function parseRollupRules(
  sequencingElement: Element
): RollupRulesConfig | undefined {
  const rollupRulesElement = sequencingElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "rollupRules"
  )[0];
  if (!rollupRulesElement) return undefined;

  const objectiveMeasureWeight = parseFloat(
    rollupRulesElement.getAttribute("objectiveMeasureWeight") || "0"
  );

  const rollupRuleElements = rollupRulesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "rollupRule"
  );
  const rollupRules: RollupRuleConfig[] = [];
  for (let i = 0; i < rollupRuleElements.length; i++) {
    const rule = rollupRuleElements[i];
    const childActivitySet = rule.getAttribute("childActivitySet") || "";
    const conditionCombination =
      (rule.getAttribute("conditionCombination") as "all" | "any") || "all";

    const conditions: RollupConditionConfig[] = [];
    const conditionsElement = rule.getElementsByTagNameNS(
      "http://www.imsglobal.org/xsd/imsss",
      "rollupConditions"
    )[0];
    if (conditionsElement) {
      const conditionElements = conditionsElement.getElementsByTagNameNS(
        "http://www.imsglobal.org/xsd/imsss",
        "rollupCondition"
      );
      for (let j = 0; j < conditionElements.length; j++) {
        conditions.push({
          condition: conditionElements[j].getAttribute("condition") || ""
        });
      }
    }

    const actionElement = rule.getElementsByTagNameNS(
      "http://www.imsglobal.org/xsd/imsss",
      "rollupAction"
    )[0];
    const action = actionElement?.getAttribute("action") || "";

    rollupRules.push({
      childActivitySet,
      conditionCombination,
      conditions,
      action
    });
  }

  return {
    objectiveMeasureWeight,
    rollupRules: rollupRules.length > 0 ? rollupRules : undefined
  };
}

/**
 * Parse objectives
 */
function parseObjectives(sequencingElement: Element): ObjectiveConfig[] {
  const objectives: ObjectiveConfig[] = [];
  const objectivesElement = sequencingElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "objectives"
  )[0];
  if (!objectivesElement) return objectives;

  // Parse primary objective
  const primaryObjective = objectivesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "primaryObjective"
  )[0];
  if (primaryObjective) {
    const objectiveID = primaryObjective.getAttribute("objectiveID") || "";
    const mapInfo = parseMapInfo(primaryObjective);
    objectives.push({
      objectiveID,
      isPrimary: true,
      mapInfo
    });
  }

  // Parse other objectives
  const objectiveElements = objectivesElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "objective"
  );
  for (let i = 0; i < objectiveElements.length; i++) {
    const obj = objectiveElements[i];
    const objectiveID = obj.getAttribute("objectiveID") || "";
    const mapInfo = parseMapInfo(obj);
    objectives.push({
      objectiveID,
      isPrimary: false,
      mapInfo
    });
  }

  return objectives;
}

/**
 * Parse mapInfo elements
 */
function parseMapInfo(
  objectiveElement: Element
): ObjectiveMapInfoConfig[] | undefined {
  const mapInfoElements = objectiveElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "mapInfo"
  );
  if (mapInfoElements.length === 0) return undefined;

  return Array.from(mapInfoElements).map((mapInfo) => ({
    targetObjectiveID: mapInfo.getAttribute("targetObjectiveID") || "",
    readSatisfiedStatus:
      mapInfo.getAttribute("readSatisfiedStatus") === "true",
    writeSatisfiedStatus:
      mapInfo.getAttribute("writeSatisfiedStatus") === "true",
    readNormalizedMeasure:
      mapInfo.getAttribute("readNormalizedMeasure") === "true",
    writeNormalizedMeasure:
      mapInfo.getAttribute("writeNormalizedMeasure") === "true",
    readCompletionStatus:
      mapInfo.getAttribute("readCompletionStatus") === "true",
    writeCompletionStatus:
      mapInfo.getAttribute("writeCompletionStatus") === "true",
    readProgressMeasure:
      mapInfo.getAttribute("readProgressMeasure") === "true",
    writeProgressMeasure:
      mapInfo.getAttribute("writeProgressMeasure") === "true"
  }));
}

/**
 * Parse sequencing controls
 */
function parseSequencingControls(
  sequencingElement: Element
): SequencingControlsConfig {
  const controlMode = sequencingElement.getElementsByTagNameNS(
    "http://www.imsglobal.org/xsd/imsss",
    "controlMode"
  )[0];
  if (!controlMode) return {};

  return {
    choice: controlMode.getAttribute("choice") === "true",
    choiceExit: controlMode.getAttribute("choiceExit") === "true",
    flow: controlMode.getAttribute("flow") === "true",
    forwardOnly: controlMode.getAttribute("forwardOnly") === "true",
    useCurrentAttemptObjectiveInfo:
      controlMode.getAttribute("useCurrentAttemptObjectiveInfo") === "true",
    useCurrentAttemptProgressInfo:
      controlMode.getAttribute("useCurrentAttemptProgressInfo") === "true"
  };
}



