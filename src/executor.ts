import { spawn } from 'child_process';
import { findEnvTemplate, parseEnvTemplate } from './parser';
import { getEnvValuesFromKeyring } from './keyring';

/**
 * Execute a command with environment variables loaded from keyring
 */
export async function executeSandboxedCommand(command: string): Promise<void> {
  // Step 1: Find .env.template
  const templatePath = findEnvTemplate();
  
  if (!templatePath) {
    console.log('No .env.template file found in current directory. Executing command without additional environment variables.');
    await executeCommand(command, {});
    return;
  }

  console.log(`Found .env.template at: ${templatePath}`);

  // Step 2: Parse environment variable names
  const envVarNames = parseEnvTemplate(templatePath);
  console.log(`Parsed ${envVarNames.length} environment variable(s): ${envVarNames.join(', ')}`);

  // Step 3: Get values from keyring
  const envValues = await getEnvValuesFromKeyring(envVarNames);
  const foundCount = Object.keys(envValues).length;
  console.log(`Retrieved ${foundCount} value(s) from keyring`);

  // Step 4: Execute command with environment variables
  await executeCommand(command, envValues);
}

/**
 * Execute a command with the given environment variables
 */
function executeCommand(command: string, envVars: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    // Merge with current environment
    const env = { ...process.env, ...envVars };

    // Determine shell based on platform
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/sh';
    const shellArgs = isWindows ? ['-Command', command] : ['-c', command];

    console.log(`\nExecuting: ${command}\n`);

    const child = spawn(shell, shellArgs, {
      env,
      stdio: 'inherit',
      shell: false
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command exited with code ${code}`));
      }
    });
  });
}
