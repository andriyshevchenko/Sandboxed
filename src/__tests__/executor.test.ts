import { executeSandboxedCommand } from '../executor';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Mock the keyring module
jest.mock('../keyring', () => ({
  getEnvValuesFromKeyring: jest.fn((varNames: string[]) => {
    // Return empty object for all tests by default
    return {};
  })
}));

describe('executeSandboxedCommand', () => {
  let tempDir: string;
  let originalCwd: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandboxed-executor-test-'));
    originalCwd = process.cwd();
    process.chdir(tempDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    // Clean up temp directory
    const files = fs.readdirSync(tempDir);
    files.forEach(file => {
      fs.unlinkSync(path.join(tempDir, file));
    });
    fs.rmdirSync(tempDir);
  });

  it('should execute command without .env.template', async () => {
    // Test execution without template file
    await expect(executeSandboxedCommand('echo test')).resolves.not.toThrow();
  });

  it('should execute command with .env.template', async () => {
    const templatePath = path.join(tempDir, '.env.template');
    fs.writeFileSync(templatePath, 'TEST_VAR=value');

    await expect(executeSandboxedCommand('echo test')).resolves.not.toThrow();
  });

  it('should handle command execution errors', async () => {
    // Test with a command that will fail
    await expect(executeSandboxedCommand('exit 1')).rejects.toThrow();
  });
});
