import * as fs from 'fs';
import * as path from 'path';

/**
 * Parse .env.template file and extract environment variable names
 */
export function parseEnvTemplate(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const envVars: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Match lines with KEY=VALUE format
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)=/);
    if (match) {
      envVars.push(match[1]);
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
