#!/usr/bin/env node

/**
 * This script helps to automate the migration of a single test file from Sinon to Vitest
 * Usage: ./scripts/convert-test-file.js test/api/ExampleTest.spec.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// Get the file path from command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path. Example: ./scripts/convert-test-file.js test/api/ExampleTest.spec.ts');
  process.exit(1);
}

try {
  // Read the file content
  const content = readFileSync(filePath, 'utf8');

  // Perform replacements
  let newContent = content;

  // 1. Update imports
  newContent = newContent.replace(
    /import.*\{.*describe.*it.*beforeEach.*afterEach.*\}.*from "mocha"/g, 
    'import { describe, it, beforeEach, afterEach, expect, vi } from "vitest"'
  );

  // Add vi import if it's not already there
  if (!newContent.includes('import { describe, it, beforeEach, afterEach, expect, vi }') && 
      !newContent.includes(', vi }')) {
    newContent = newContent.replace(
      /(import.*\{.*describe.*it.*beforeEach.*afterEach.*expect.*\}.*from "vitest")/g,
      '$1\nimport { vi } from "vitest"'
    );
  }

  // Remove sinon imports
  newContent = newContent.replace(/import \* as sinon from "sinon";?\n?/g, '');
  newContent = newContent.replace(/import \{ SinonStub \} from "sinon";?\n?/g, '');

  // 2. Update type declarations
  newContent = newContent.replace(/sinon\.SinonStub/g, 'ReturnType<typeof vi.spyOn>');
  newContent = newContent.replace(/SinonStub/g, 'ReturnType<typeof vi.spyOn>');

  // 3. Update stub and spy creation
  newContent = newContent.replace(
    /sinon\.stub\(([^,]+), "([^"]+)"\)\.returns\(([^)]+)\)/g, 
    'vi.spyOn($1, "$2").mockReturnValue($3)'
  );
  newContent = newContent.replace(
    /sinon\.stub\(([^,]+), "([^"]+)"\)/g, 
    'vi.spyOn($1, "$2").mockImplementation(() => {})'
  );
  newContent = newContent.replace(
    /sinon\.spy\(([^,]+), "([^"]+)"\)/g,
    'vi.spyOn($1, "$2")'
  );
  newContent = newContent.replace(/sinon\.spy\(\)/g, 'vi.fn()');

  // 4. Update assertions
  newContent = newContent.replace(
    /expect\(([^)]+)\.calledOnce\)\.toBe\(true\)/g,
    'expect($1).toHaveBeenCalledOnce()'
  );
  newContent = newContent.replace(
    /expect\(([^)]+)\.called\)\.toBe\(true\)/g,
    'expect($1).toHaveBeenCalled()'
  );
  newContent = newContent.replace(
    /expect\(([^)]+)\.calledWith\(([^)]+)\)\)\.toBe\(true\)/g,
    'expect($1).toHaveBeenCalledWith($2)'
  );
  newContent = newContent.replace(
    /expect\(([^)]+)\.calledWith\(([^)]+)\)\)\.toBe\(false\)/g,
    'expect($1).not.toHaveBeenCalledWith($2)'
  );

  // 5. Update cleanup
  newContent = newContent.replace(/sinon\.restore\(\);?/g, 'vi.restoreAllMocks();');
  newContent = newContent.replace(/([a-zA-Z0-9_]+)\.restore\(\);?/g, '// $1.restore() - not needed with vi.restoreAllMocks()');

  // Write the updated content back to the file
  writeFileSync(filePath, newContent, 'utf8');

  console.log(`Successfully converted ${filePath} to use Vitest instead of Sinon.`);
  console.log('Note: This is an automated conversion. Please review the file for any issues or edge cases that might need manual attention.');

} catch (error) {
  console.error(`Error converting file: ${error.message}`);
  process.exit(1);
} 