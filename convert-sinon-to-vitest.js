#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const testDir = path.join(__dirname, 'test');
const dryRun = process.argv.includes('--dry-run');
const verbose = process.argv.includes('--verbose');
const targetFile = process.argv.find(arg => arg.startsWith('--file='))?.split('=')[1];

// Conversion rules
const replacements = [
  // 1. Import statements
  { 
    regex: /import \* as sinon from ['"]sinon['"];?/g, 
    replacement: '' 
  },
  {
    regex: /import { (.*) } from ['"]vitest['"];?/g,
    replacement: (match, imports) => {
      if (!imports.includes('vi')) {
        return `import { ${imports}, vi } from "vitest";`;
      }
      return match;
    }
  },
  {
    regex: /import { vitest } from ['"]vitest['"];?/g,
    replacement: 'import { vi } from "vitest";'
  },
  
  // 2. Type declarations
  {
    regex: /let (\w+): sinon\.SinonSpy;/g,
    replacement: 'let $1: ReturnType<typeof vi.fn>;'
  },
  {
    regex: /let (\w+): sinon\.SinonStub;/g, 
    replacement: 'let $1: ReturnType<typeof vi.fn>;'
  },
  {
    regex: /let (\w+): sinon\.SinonFakeTimers;/g, 
    replacement: 'let $1: void;'
  },
  
  // 3. Spy/Stub creation
  {
    regex: /sinon\.spy\(\)/g, 
    replacement: 'vi.fn()'
  },
  {
    regex: /sinon\.spy\((\w+), ["'](\w+)["']\)/g, 
    replacement: 'vi.spyOn($1, "$2")'
  },
  {
    regex: /sinon\.stub\(\)/g, 
    replacement: 'vi.fn()'
  },
  {
    regex: /sinon\.stub\((\w+), ["'](\w+)["']\)\.returns\((.*)\)/g, 
    replacement: 'vi.spyOn($1, "$2").mockReturnValue($3)'
  },
  {
    regex: /sinon\.stub\((\w+), ["'](\w+)["']\)\.mockImplementation/g, 
    replacement: 'vi.spyOn($1, "$2").mockImplementation'
  },
  {
    regex: /sinon\.stub\((\w+), ["'](\w+)["']\)/g, 
    replacement: 'vi.spyOn($1, "$2").mockImplementation(() => {})'
  },
  {
    regex: /(\w+) = sinon\.stub\(\)/g, 
    replacement: '$1 = vi.fn()'
  },
  {
    regex: /(\w+)\.returns\((.*)\)/g, 
    replacement: '$1.mockReturnValue($2)'
  },
  
  // 4. Timer mocking
  {
    regex: /sinon\.useFakeTimers\(\)/g, 
    replacement: 'vi.useFakeTimers()'
  },
  {
    regex: /clock\.tick\((\d+)\)/g, 
    replacement: 'vi.advanceTimersByTime($1)'
  },
  {
    regex: /clock\.restore\(\)/g, 
    replacement: 'vi.useRealTimers()'
  },
  {
    regex: /await clock\.runAllAsync\(\)/g, 
    replacement: 'await vi.runAllTimersAsync()'
  },
  
  // 5. Assertions
  {
    regex: /expect\((\w+)\.notCalled\)\.toBe\(true\)/g, 
    replacement: 'expect($1).not.toHaveBeenCalled()'
  },
  {
    regex: /expect\((\w+)\.calledOnce\)\.toBe\(true\)/g, 
    replacement: 'expect($1).toHaveBeenCalledOnce()'
  },
  {
    regex: /expect\((\w+)\.callCount\)\.toBe\((\d+)\)/g, 
    replacement: 'expect($1).toHaveBeenCalledTimes($2)'
  },
  {
    regex: /(\w+)\.getCall\((\d+)\)\.args/g, 
    replacement: (match, fnName, callIndex) => {
      const callNum = parseInt(callIndex) + 1;
      return `$1.mock.calls[${callIndex}]`;
    }
  },
  {
    regex: /expect\((\w+)\.calledWith\((.*)\)\)\.toBe\(true\)/g, 
    replacement: 'expect($1).toHaveBeenCalledWith($2)'
  },
  {
    regex: /expect\((\w+)\.calledWithExactly\((.*)\)\)\.toBe\(true\)/g, 
    replacement: 'expect($1).toHaveBeenCalledWith($2)'
  },
  {
    regex: /(\w+)\.calledWith\(\)/g, 
    replacement: '$1.mock.calls.length > 0 && $1.mock.calls[0].length === 0'
  },
  {
    regex: /(\w+)\.calledWith\((.*)\)/g, 
    replacement: '$1.mock.calls.some(call => JSON.stringify(call) === JSON.stringify([$2]))'
  },
  {
    regex: /(\w+)\.calledOnce/g, 
    replacement: '$1.mock.calls.length === 1'
  },
  {
    regex: /(\w+)\.calledTwice/g, 
    replacement: '$1.mock.calls.length === 2'
  },
  {
    regex: /(\w+)\.calledThrice/g, 
    replacement: '$1.mock.calls.length === 3'
  },
  
  // 6. Match utilities
  {
    regex: /sinon\.match\.instanceOf\((\w+)\)/g, 
    replacement: 'expect.any($1)'
  },
];

// Process a file with all replacements
function processFile(filePath) {
  if (verbose || dryRun) {
    console.log(`Processing ${filePath}...`);
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let changes = 0;
  
  for (const rule of replacements) {
    const newContent = content.replace(rule.regex, rule.replacement);
    if (newContent !== content) {
      if (verbose) {
        console.log(`  Applied rule: ${rule.regex}`);
      }
      content = newContent;
      changes++;
    }
  }
  
  // If content was modified, write it back
  if (content !== originalContent) {
    if (!dryRun) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated ${filePath} (${changes} changes)`);
    } else {
      console.log(`Would update ${filePath} (${changes} changes)`);
    }
    return true;
  } else {
    if (verbose) {
      console.log(`No changes needed for ${filePath}`);
    }
    return false;
  }
}

// Process a directory recursively for all .spec.ts files
function processDirectory(dir) {
  let totalChanges = 0;
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalChanges += processDirectory(filePath);
    } else if (stats.isFile() && file.endsWith('.spec.ts')) {
      if (file === 'CrossFrameFacade.spec.ts' || 
          file === 'EventService.spec.ts' || 
          file === 'PerformanceTests.spec.ts') {
        if (verbose) {
          console.log(`Skipping already converted file: ${filePath}`);
        }
        continue;
      }
      
      if (processFile(filePath)) {
        totalChanges++;
      }
    }
  }
  
  return totalChanges;
}

// Main execution
console.log('Converting Sinon to Vitest...');
console.log(`Mode: ${dryRun ? 'Dry Run' : 'Live'}`);

if (targetFile) {
  const filePath = path.resolve(targetFile);
  if (fs.existsSync(filePath)) {
    processFile(filePath);
  } else {
    console.error(`File not found: ${filePath}`);
  }
} else {
  const changedFiles = processDirectory(testDir);
  console.log(`Conversion complete. Modified ${changedFiles} files.`);
}

console.log('Remember to manually check and fix any remaining issues!'); 