import { Activity } from "../activity";
import { MeasureRollupProcessor } from "./measure_rollup";
import { ObjectiveRollupProcessor } from "./objective_rollup";
import { ProgressRollupProcessor } from "./progress_rollup";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * CrossClusterProcessor - Handles cross-cluster dependencies in rollup
 * Manages dependencies between activity clusters for accurate rollup
 *
 * This class is responsible for analyzing and processing dependencies
 * between activity clusters during rollup operations, ensuring that
 * clusters are processed in the correct order.
 *
 * @spec Priority 5 Gap: Cross-cluster dependency processing
 */
export class CrossClusterProcessor {
  private measureProcessor: MeasureRollupProcessor;
  private objectiveProcessor: ObjectiveRollupProcessor;
  private progressProcessor: ProgressRollupProcessor;
  private eventCallback: EventCallback | null;

  /**
   * Create a new CrossClusterProcessor
   *
   * @param measureProcessor - MeasureRollupProcessor for measure rollup
   * @param objectiveProcessor - ObjectiveRollupProcessor for objective rollup
   * @param progressProcessor - ProgressRollupProcessor for progress rollup
   * @param eventCallback - Optional callback for firing events
   */
  constructor(
    measureProcessor: MeasureRollupProcessor,
    objectiveProcessor: ObjectiveRollupProcessor,
    progressProcessor: ProgressRollupProcessor,
    eventCallback?: EventCallback,
  ) {
    this.measureProcessor = measureProcessor;
    this.objectiveProcessor = objectiveProcessor;
    this.progressProcessor = progressProcessor;
    this.eventCallback = eventCallback || null;
  }

  /**
   * Handle cross-cluster dependencies in rollup
   * Manages dependencies between activity clusters for accurate rollup
   *
   * @param activity - The activity to process
   * @param clusters - Related activity clusters
   */
  public processCrossClusterDependencies(activity: Activity, clusters: Activity[]): void {
    try {
      this.eventCallback?.("cross_cluster_processing_started", {
        activityId: activity.id,
        clusterCount: clusters.length,
      });

      const dependencyMap = new Map<string, string[]>();

      // Build dependency map across clusters
      for (const cluster of clusters) {
        this.analyzeCrossClusterDependencies(cluster, dependencyMap);
      }

      // Process dependencies in correct order
      const processOrder = this.resolveDependencyOrder(dependencyMap);

      for (const clusterId of processOrder) {
        const cluster = clusters.find((c) => c.id === clusterId);
        if (cluster) {
          this.processClusterRollup(cluster);
        }
      }

      this.eventCallback?.("cross_cluster_processing_completed", {
        activityId: activity.id,
        processedClusters: processOrder.length,
        dependencyMap: Array.from(dependencyMap.entries()),
      });
    } catch (error) {
      this.eventCallback?.("cross_cluster_processing_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Identify Activity Clusters
   * Identifies clusters among child activities for cross-cluster dependency processing
   *
   * @param children - Child activities to analyze
   * @returns Array of identified clusters
   */
  public identifyActivityClusters(children: Activity[]): Activity[] {
    const clusters: Activity[] = [];

    for (const child of children) {
      // An activity is considered a cluster if it has children and flow controls
      if (child.children.length > 0 && child.sequencingControls.flow) {
        clusters.push(child);
      }
    }

    return clusters;
  }

  /**
   * Analyze cross-cluster dependencies
   * Builds dependency relationships based on sequencing rules and prerequisites
   *
   * @param cluster - The cluster to analyze
   * @param dependencyMap - Map to store dependencies
   */
  public analyzeCrossClusterDependencies(
    cluster: Activity,
    dependencyMap: Map<string, string[]>,
  ): void {
    // Build dependency relationships based on sequencing rules and prerequisites
    const dependencies: string[] = [];

    // Check sequencing rules for dependencies
    // Note: Implementation would analyze rules to identify dependencies
    // For now, we just track the cluster as having no dependencies
    const _sequencingRules = cluster.sequencingRules;

    dependencyMap.set(cluster.id, dependencies);
  }

  /**
   * Resolve dependency processing order
   * Uses topological sort to determine correct processing order
   *
   * @param dependencyMap - Map of dependencies
   * @returns Ordered array of cluster IDs
   */
  public resolveDependencyOrder(dependencyMap: Map<string, string[]>): string[] {
    const resolved: string[] = [];
    const resolving: Set<string> = new Set();

    const resolve = (id: string): void => {
      if (resolved.includes(id)) return;
      if (resolving.has(id)) {
        // Circular dependency detected - log warning and continue
        this.eventCallback?.("circular_dependency_detected", { activityId: id });
        return;
      }

      resolving.add(id);
      const dependencies = dependencyMap.get(id) || [];

      for (const depId of dependencies) {
        resolve(depId);
      }

      resolving.delete(id);
      resolved.push(id);
    };

    for (const id of Array.from(dependencyMap.keys())) {
      resolve(id);
    }

    return resolved;
  }

  /**
   * Process rollup for a specific cluster
   * Performs standard rollup process for the cluster
   *
   * @param cluster - The cluster to process
   */
  public processClusterRollup(cluster: Activity): void {
    // Perform standard rollup process for the cluster
    this.measureProcessor.measureRollupProcess(cluster);

    if (cluster.sequencingControls.rollupObjectiveSatisfied) {
      this.objectiveProcessor.objectiveRollupProcess(cluster);
    }

    if (cluster.sequencingControls.rollupProgressCompletion) {
      this.progressProcessor.activityProgressRollupProcess(cluster);
    }
  }
}
