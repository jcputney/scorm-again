import { test as base } from '@playwright/test';

// Custom test fixture with demo-specific utilities
export const test = base.extend({
  // Add demo-specific fixtures here if needed
});

export { expect } from '@playwright/test';
