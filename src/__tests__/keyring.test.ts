import { getFromKeyring, getEnvValuesFromKeyring } from '../keyring';
import { Entry } from '@napi-rs/keyring';

// Mock the @napi-rs/keyring module
jest.mock('@napi-rs/keyring', () => {
  return {
    Entry: jest.fn().mockImplementation((service: string, username: string) => {
      return {
        getPassword: jest.fn().mockImplementation(() => {
          // Simulate keyring behavior
          if (username === 'EXISTING_VAR') {
            return 'test-value';
          }
          // Simulate missing entry by throwing error
          throw new Error('No entry found');
        })
      };
    })
  };
});

describe('getFromKeyring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return value when variable exists in keyring', () => {
    const result = getFromKeyring('EXISTING_VAR');
    expect(result).toBe('test-value');
  });

  it('should return null when variable does not exist in keyring', () => {
    const result = getFromKeyring('NON_EXISTENT_VAR');
    expect(result).toBeNull();
  });

  it('should use correct service name', () => {
    getFromKeyring('TEST_VAR');
    expect(Entry).toHaveBeenCalledWith('sandboxed', 'TEST_VAR');
  });
});

describe('getEnvValuesFromKeyring', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return empty object when no variables provided', () => {
    const result = getEnvValuesFromKeyring([]);
    expect(result).toEqual({});
  });

  it('should return values for existing variables', () => {
    const result = getEnvValuesFromKeyring(['EXISTING_VAR']);
    expect(result).toEqual({ EXISTING_VAR: 'test-value' });
  });

  it('should skip non-existent variables', () => {
    const result = getEnvValuesFromKeyring(['NON_EXISTENT_VAR']);
    expect(result).toEqual({});
  });

  it('should return mixed results for existing and non-existing variables', () => {
    const result = getEnvValuesFromKeyring(['EXISTING_VAR', 'NON_EXISTENT_VAR', 'ANOTHER_NON_EXISTENT']);
    expect(result).toEqual({ EXISTING_VAR: 'test-value' });
  });
});
