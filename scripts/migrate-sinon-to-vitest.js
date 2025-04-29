#!/usr/bin/env node

/**
 * This script finds all test files that use Sinon and provides guidance on
 * how to migrate them to Vitest.
 */

import { readFileSync } from 'fs';
import { execSync } from 'child_process';

// Find all test files that import sinon
console.log("Finding test files that use Sinon...");
const files = execSync('grep -l "import.*sinon" test/**/*.ts').toString().trim().split('\n');

console.log(`Found ${files.length} files that import Sinon:\n${files.join('\n')}`);
console.log("\nMigration guide:");
console.log("Here's how to migrate Sinon to Vitest's built-in mocking capabilities:");
console.log("\n1. Replace imports:");
console.log("   - Remove: import * as sinon from 'sinon';");
console.log("   - Remove: import { SinonStub } from 'sinon';");
console.log("   - Ensure: import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';");
console.log("\n2. Replace types:");
console.log("   - Replace: sinon.SinonStub → ReturnType<typeof vi.fn> or ReturnType<typeof vi.spyOn>");
console.log("\n3. Replace stubs and spies:");
console.log("   - Replace: sinon.stub(obj, 'method') → vi.spyOn(obj, 'method').mockImplementation(() => {})");
console.log("   - Replace: sinon.stub(obj, 'method').returns(value) → vi.spyOn(obj, 'method').mockReturnValue(value)");
console.log("   - Replace: sinon.spy(obj, 'method') → vi.spyOn(obj, 'method')");
console.log("   - Replace: sinon.spy() → vi.fn()");
console.log("\n4. Replace assertions:");
console.log("   - Replace: expect(stub.calledOnce).toBe(true) → expect(stub).toHaveBeenCalledOnce()");
console.log("   - Replace: expect(stub.called).toBe(true) → expect(stub).toHaveBeenCalled()");
console.log("   - Replace: expect(stub.calledWith(args)).toBe(true) → expect(stub).toHaveBeenCalledWith(args)");
console.log("   - Replace: stub.callCount → vi.mocked(stub).mock.calls.length");
console.log("\n5. Replace cleanup:");
console.log("   - Replace: sinon.restore() → vi.restoreAllMocks()");
console.log("   - Replace: stub.restore() → Not needed, vi.restoreAllMocks() handles it");
console.log("\nExample migration pattern:");
console.log(`
Before:
  import * as sinon from 'sinon';
  import { SinonStub } from 'sinon';
  
  let logServiceStub: sinon.SinonStub;
  
  beforeEach(() => {
    logServiceStub = sinon.stub(getLoggingService(), "log");
  });
  
  afterEach(() => {
    logServiceStub.restore();
    sinon.restore();
  });
  
  it('should test something', () => {
    const renderCMIToJSONStringStub = sinon
      .stub(api["_serializationService"], "renderCMIToJSONString")
      .returns("{}");
      
    expect(renderCMIToJSONStringStub.calledOnce).toBe(true);
    expect(renderCMIToJSONStringStub.calledWith(args)).toBe(true);
  });

After:
  import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
  
  let logServiceStub: ReturnType<typeof vi.spyOn>;
  
  beforeEach(() => {
    logServiceStub = vi.spyOn(getLoggingService(), "log").mockImplementation(() => {});
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should test something', () => {
    const renderCMIToJSONStringStub = vi
      .spyOn(api["_serializationService"], "renderCMIToJSONString")
      .mockReturnValue("{}");
      
    expect(renderCMIToJSONStringStub).toHaveBeenCalledOnce();
    expect(renderCMIToJSONStringStub).toHaveBeenCalledWith(args);
  });
`);

console.log("\nYou can now manually update each file following these guidelines.");
console.log("For complex mocking scenarios, you may need to adapt the patterns case by case."); 