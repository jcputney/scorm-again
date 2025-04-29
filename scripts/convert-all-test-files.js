#!/usr/bin/env node

/**
 * This script converts all test files from Sinon to Vitest
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';

console.log("Finding test files that use Sinon...");
const filesOutput = execSync('grep -l "import.*sinon" test/**/*.ts').toString().trim();
const files = filesOutput.split('\n').filter(Boolean);

console.log(`Found ${files.length} files that use Sinon.`);

// Define conversion functions
function performReplacements(content) {
  // 1. Update imports
  let newContent = content.replace(
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

  // Replace vitest adapter imports
  newContent = newContent.replace(
    /import \{ afterEach, beforeEach, describe, it(?:, expect)? \} from "..\/vitest-adapter";/g,
    'import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";'
  );

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
    /expect\(([^)]+)\.called\)\.toBe\(false\)/g,
    'expect($1).not.toHaveBeenCalled()'
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
  
  // 6. Fix resetHistory
  newContent = newContent.replace(/([a-zA-Z0-9_]+)\.resetHistory\(\);?/g, 'vi.clearAllMocks();');
  
  return newContent;
}

// Iterate through files and convert them
let processedCount = 0;
let errorCount = 0;

for (const file of files) {
  try {
    console.log(`Converting ${file}...`);
    const content = readFileSync(file, 'utf8');
    const newContent = performReplacements(content);
    writeFileSync(file, newContent, 'utf8');
    processedCount++;
  } catch (error) {
    console.error(`Error processing ${file}: ${error.message}`);
    errorCount++;
  }
}

console.log(`\nConversion complete!`);
console.log(`Successfully converted: ${processedCount} files`);
if (errorCount > 0) {
  console.log(`Failed to convert: ${errorCount} files`);
}
console.log(`\nPlease review the converted files for any issues or special cases that might need manual attention.`);
console.log(`Common issues to look for and fix manually:`);
console.log(`1. vi.fn() should be used instead of vi.spyOn() for mock functions that are not spying on an existing method`);
console.log(`2. Check for incorrect 'toHaveBeenCalledWith' parameters`);
console.log(`3. Make sure 'afterEach' blocks use 'vi.restoreAllMocks()'`);
console.log(`4. Replace complex callCount assertions with 'expect(mock.mock.calls.length).toBe(n)'`); 