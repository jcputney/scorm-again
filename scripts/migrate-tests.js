#!/usr/bin/env node

/**
 * This script helps migrate test files from Mocha to Vitest.
 * It replaces Mocha import statements with Vitest import statements.
 * 
 * Usage: node scripts/migrate-tests.js <file-pattern>
 * Example: node scripts/migrate-tests.js test/api/*.spec.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const filePattern = process.argv[2] || 'test/**/*.spec.ts';

// Find all test files matching the pattern
const files = globSync(filePattern, {
  cwd: path.resolve(__dirname, '..'),
  absolute: true,
});

if (files.length === 0) {
  console.error(`No files found matching pattern: ${filePattern}`);
  process.exit(1);
}

console.log(`Found ${files.length} files to migrate`);

// Function to calculate the relative path to vitest-adapter.ts
function getRelativePathToAdapter(filePath) {
  const testDirPath = path.resolve(__dirname, '../test');
  const fileDir = path.dirname(filePath);
  const relativePath = path.relative(fileDir, testDirPath);
  return `${relativePath}/vitest-adapter`;
}

// Regular expressions for replacements
const createReplacements = (filePath) => {
  const relativePath = getRelativePathToAdapter(filePath);
  return [
    {
      // Replace Mocha imports with Vitest adapter imports
      pattern: /import\s+\{\s*([\w\s,]+)\s*\}\s+from\s+["']mocha["']/,
      replacement: `import { $1 } from "${relativePath}"`,
    },
    {
      // Replace expect import with Vitest adapter import if it's also importing from adapter
      pattern: /import\s+\{\s*expect\s*\}\s+from\s+["']expect["']/,
      condition: (content) => content.includes(`from "${relativePath}"`),
      replacement: '', // Remove this import since expect is already in the adapter
    },
    {
      // Replace expect import with Vitest adapter import if it's standalone
      pattern: /import\s+\{\s*expect\s*\}\s+from\s+["']expect["']/,
      condition: (content) => !content.includes(`from "${relativePath}"`),
      replacement: `import { expect } from "${relativePath}"`,
    },
    {
      // Fix incorrect paths to vitest-adapter
      pattern: /import\s+\{\s*([\w\s,]+)\s*\}\s+from\s+["']\.\.\/vitest-adapter["']/,
      replacement: `import { $1 } from "${relativePath}"`,
    },
  ];
};

// Process each file
for (const file of files) {
  try {
    console.log(`Processing ${path.relative(process.cwd(), file)}`);
    
    // Read the file content
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Get replacements for this file
    const replacements = createReplacements(file);
    
    // Apply replacements
    for (const { pattern, replacement, condition } of replacements) {
      if (condition && !condition(content)) {
        continue;
      }
      
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    // Write the modified content back to the file
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`  ✅ Updated`);
    } else {
      console.log(`  ⏭️  No changes needed`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
}

console.log('Migration complete!'); 