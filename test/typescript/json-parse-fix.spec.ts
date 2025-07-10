/**
 * Test to verify that the TypeScript JSON.parse type issue is resolved
 */
import { describe, it, expect } from 'vitest';
import { SerializationService } from '../../src/services/SerializationService';
import { LoggingService } from '../../src/services/LoggingService';

describe('TypeScript JSON.parse fix', () => {
  it('should return StringKeyMap type from renderCMIToJSONObject without TypeScript errors', () => {
    const loggingService = new LoggingService();
    const serializationService = new SerializationService(loggingService);
    
    const mockCMI = {
      core: {
        student_id: 'test123',
        student_name: 'Test User',
        lesson_status: 'incomplete'
      }
    };
    
    // This should not cause TypeScript compilation errors
    const result = serializationService.renderCMIToJSONObject(mockCMI, true);
    
    // Verify the result is a proper object with string keys
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
    expect(result).not.toBeNull();
    
    // Ensure we can access properties as expected from StringKeyMap
    if (result && typeof result === 'object' && 'cmi' in result) {
      const cmi = result.cmi as any;
      expect(cmi.core.student_id).toBe('test123');
    }
  });
});