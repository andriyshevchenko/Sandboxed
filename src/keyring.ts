import { Entry } from '@napi-rs/keyring';

/**
 * Retrieve value for an environment variable from the system keyring
 * @param varName - The name of the environment variable
 * @returns The value from keyring or null if not found
 */
export function getFromKeyring(varName: string): string | null {
  try {
    const service = 'sandboxed';
    const entry = new Entry(service, varName);
    const value = entry.getPassword();
    return value;
  } catch (error) {
    // Variable not found in keyring or other error occurred
    // This is expected behavior when a variable hasn't been stored yet
    return null;
  }
}

/**
 * Retrieve values for multiple environment variables from keyring
 */
export function getEnvValuesFromKeyring(varNames: string[]): Record<string, string> {
  const envValues: Record<string, string> = {};

  for (const varName of varNames) {
    const value = getFromKeyring(varName);
    if (value !== null) {
      envValues[varName] = value;
    }
  }

  return envValues;
}
