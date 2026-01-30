import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse .env.template file and extract environment variable names
 * 
 * This function looks for lines in the format KEY=VALUE where KEY matches
 * the pattern [A-Z_][A-Z0-9_]*, which is the standard convention for
 * environment variable names (uppercase letters, digits, and underscores,
 * starting with a letter or underscore).
 * 
 * If the same variable name appears multiple times, only the first occurrence
 * is included in the returned array (duplicates are automatically deduplicated).
 * 
 * @param filePath - Path to the .env.template file
 * @returns Array of unique environment variable names
 */
export function parseEnvTemplate(filePath: string): string[] {
  let content: string;
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read env template file at "${filePath}": ${message}`);
  }
  const lines = content.split('\n');
  const envVars: string[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Match lines with KEY=VALUE format
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      const varName = match[1];
      // Only add if not already seen (deduplicate)
      if (!seen.has(varName)) {
        envVars.push(varName);
        seen.add(varName);
      }
    }
  }

  return envVars;
}

/**
 * Check if .env.template file exists in the current directory
 */
export function findEnvTemplate(cwd: string = process.cwd()): string | null {
  const templatePath = path.join(cwd, '.env.template');
  
  if (fs.existsSync(templatePath)) {
    return templatePath;
  }
  
  return null;
}
