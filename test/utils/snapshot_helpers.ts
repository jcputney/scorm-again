/**
 * Snapshot testing utilities for SCORM Again
 * 
 * This file contains utility functions for snapshot testing complex objects.
 */

import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'expect';

// Default directory for storing snapshots
const DEFAULT_SNAPSHOT_DIR = '__snapshots__';

/**
 * Options for snapshot testing
 */
export interface SnapshotOptions {
  /**
   * Directory to store snapshots in
   */
  snapshotDir?: string;
  
  /**
   * Whether to update snapshots automatically
   */
  updateSnapshots?: boolean;
  
  /**
   * Whether to create snapshots if they don't exist
   */
  createSnapshots?: boolean;
  
  /**
   * Custom serializer function
   */
  serializer?: (obj: any) => string;
  
  /**
   * Custom deserializer function
   */
  deserializer?: (data: string) => any;
}

/**
 * Default options for snapshot testing
 */
const defaultOptions: SnapshotOptions = {
  snapshotDir: DEFAULT_SNAPSHOT_DIR,
  updateSnapshots: process.env.UPDATE_SNAPSHOTS === 'true',
  createSnapshots: true,
  serializer: (obj: any) => JSON.stringify(obj, null, 2),
  deserializer: (data: string) => JSON.parse(data)
};

/**
 * Creates a snapshot of an object
 * 
 * @param obj - The object to create a snapshot of
 * @param options - Options for creating the snapshot
 * @returns A string representation of the object
 */
export const createSnapshot = (
  obj: any,
  options: Partial<SnapshotOptions> = {}
): string => {
  const opts = { ...defaultOptions, ...options };
  return opts.serializer!(obj);
};

/**
 * Gets the path to a snapshot file
 * 
 * @param testName - The name of the test
 * @param snapshotName - The name of the snapshot
 * @param options - Options for getting the snapshot path
 * @returns The path to the snapshot file
 */
export const getSnapshotPath = (
  testName: string,
  snapshotName: string,
  options: Partial<SnapshotOptions> = {}
): string => {
  const opts = { ...defaultOptions, ...options };
  const snapshotDir = opts.snapshotDir!;
  
  // Create the snapshot directory if it doesn't exist
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  
  return path.join(snapshotDir, `${testName}.${snapshotName}.snap`);
};

/**
 * Saves a snapshot to a file
 * 
 * @param testName - The name of the test
 * @param snapshotName - The name of the snapshot
 * @param data - The data to save
 * @param options - Options for saving the snapshot
 */
export const saveSnapshot = (
  testName: string,
  snapshotName: string,
  data: any,
  options: Partial<SnapshotOptions> = {}
): void => {
  const opts = { ...defaultOptions, ...options };
  const snapshotPath = getSnapshotPath(testName, snapshotName, opts);
  const serializedData = opts.serializer!(data);
  
  fs.writeFileSync(snapshotPath, serializedData);
};

/**
 * Loads a snapshot from a file
 * 
 * @param testName - The name of the test
 * @param snapshotName - The name of the snapshot
 * @param options - Options for loading the snapshot
 * @returns The loaded snapshot, or undefined if the snapshot doesn't exist
 */
export const loadSnapshot = (
  testName: string,
  snapshotName: string,
  options: Partial<SnapshotOptions> = {}
): any | undefined => {
  const opts = { ...defaultOptions, ...options };
  const snapshotPath = getSnapshotPath(testName, snapshotName, opts);
  
  if (!fs.existsSync(snapshotPath)) {
    return undefined;
  }
  
  const data = fs.readFileSync(snapshotPath, 'utf8');
  return opts.deserializer!(data);
};

/**
 * Compares an object to a snapshot
 * 
 * @param testName - The name of the test
 * @param snapshotName - The name of the snapshot
 * @param actual - The object to compare
 * @param options - Options for comparing the snapshot
 */
export const expectToMatchSnapshot = (
  testName: string,
  snapshotName: string,
  actual: any,
  options: Partial<SnapshotOptions> = {}
): void => {
  const opts = { ...defaultOptions, ...options };
  const snapshotPath = getSnapshotPath(testName, snapshotName, opts);
  
  // Create the snapshot if it doesn't exist
  if (!fs.existsSync(snapshotPath)) {
    if (opts.createSnapshots) {
      saveSnapshot(testName, snapshotName, actual, opts);
      return;
    } else {
      throw new Error(`Snapshot does not exist: ${snapshotPath}`);
    }
  }
  
  // Update the snapshot if requested
  if (opts.updateSnapshots) {
    saveSnapshot(testName, snapshotName, actual, opts);
    return;
  }
  
  // Load the snapshot and compare
  const expected = loadSnapshot(testName, snapshotName, opts);
  const actualSerialized = opts.serializer!(actual);
  const expectedSerialized = opts.serializer!(expected);
  
  expect(actualSerialized).toEqual(expectedSerialized);
};

/**
 * Deletes a snapshot file
 * 
 * @param testName - The name of the test
 * @param snapshotName - The name of the snapshot
 * @param options - Options for deleting the snapshot
 * @returns True if the snapshot was deleted, false if it didn't exist
 */
export const deleteSnapshot = (
  testName: string,
  snapshotName: string,
  options: Partial<SnapshotOptions> = {}
): boolean => {
  const opts = { ...defaultOptions, ...options };
  const snapshotPath = getSnapshotPath(testName, snapshotName, opts);
  
  if (!fs.existsSync(snapshotPath)) {
    return false;
  }
  
  fs.unlinkSync(snapshotPath);
  return true;
};

/**
 * Deletes all snapshots for a test
 * 
 * @param testName - The name of the test
 * @param options - Options for deleting the snapshots
 * @returns The number of snapshots deleted
 */
export const deleteAllSnapshots = (
  testName: string,
  options: Partial<SnapshotOptions> = {}
): number => {
  const opts = { ...defaultOptions, ...options };
  const snapshotDir = opts.snapshotDir!;
  
  if (!fs.existsSync(snapshotDir)) {
    return 0;
  }
  
  const files = fs.readdirSync(snapshotDir);
  const testSnapshots = files.filter(file => file.startsWith(`${testName}.`) && file.endsWith('.snap'));
  
  testSnapshots.forEach(file => {
    fs.unlinkSync(path.join(snapshotDir, file));
  });
  
  return testSnapshots.length;
};

/**
 * Creates a snapshot tester for a specific test
 * 
 * @param testName - The name of the test
 * @param options - Options for the snapshot tester
 * @returns An object with methods for snapshot testing
 */
export const createSnapshotTester = (
  testName: string,
  options: Partial<SnapshotOptions> = {}
) => {
  const opts = { ...defaultOptions, ...options };
  
  return {
    /**
     * Compares an object to a snapshot
     * 
     * @param snapshotName - The name of the snapshot
     * @param actual - The object to compare
     * @param snapshotOptions - Additional options for this specific snapshot
     */
    expectToMatchSnapshot: (
      snapshotName: string,
      actual: any,
      snapshotOptions: Partial<SnapshotOptions> = {}
    ) => {
      expectToMatchSnapshot(
        testName,
        snapshotName,
        actual,
        { ...opts, ...snapshotOptions }
      );
    },
    
    /**
     * Saves a snapshot
     * 
     * @param snapshotName - The name of the snapshot
     * @param data - The data to save
     * @param snapshotOptions - Additional options for this specific snapshot
     */
    saveSnapshot: (
      snapshotName: string,
      data: any,
      snapshotOptions: Partial<SnapshotOptions> = {}
    ) => {
      saveSnapshot(
        testName,
        snapshotName,
        data,
        { ...opts, ...snapshotOptions }
      );
    },
    
    /**
     * Loads a snapshot
     * 
     * @param snapshotName - The name of the snapshot
     * @param snapshotOptions - Additional options for this specific snapshot
     * @returns The loaded snapshot, or undefined if the snapshot doesn't exist
     */
    loadSnapshot: (
      snapshotName: string,
      snapshotOptions: Partial<SnapshotOptions> = {}
    ) => {
      return loadSnapshot(
        testName,
        snapshotName,
        { ...opts, ...snapshotOptions }
      );
    },
    
    /**
     * Deletes a snapshot
     * 
     * @param snapshotName - The name of the snapshot
     * @param snapshotOptions - Additional options for this specific snapshot
     * @returns True if the snapshot was deleted, false if it didn't exist
     */
    deleteSnapshot: (
      snapshotName: string,
      snapshotOptions: Partial<SnapshotOptions> = {}
    ) => {
      return deleteSnapshot(
        testName,
        snapshotName,
        { ...opts, ...snapshotOptions }
      );
    },
    
    /**
     * Deletes all snapshots for this test
     * 
     * @param snapshotOptions - Additional options for this operation
     * @returns The number of snapshots deleted
     */
    deleteAllSnapshots: (
      snapshotOptions: Partial<SnapshotOptions> = {}
    ) => {
      return deleteAllSnapshots(
        testName,
        { ...opts, ...snapshotOptions }
      );
    }
  };
};