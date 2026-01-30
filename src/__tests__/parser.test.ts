import { parseEnvTemplate, findEnvTemplate } from '../parser';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

describe('parseEnvTemplate', () => {
  let tempDir: string;
  let templatePath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandboxed-test-'));
    templatePath = path.join(tempDir, '.env.template');
  });

  afterEach(() => {
    // Clean up temp directory recursively and forcefully
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should parse environment variables from template', () => {
    const content = `# ===============================
# Application
# ===============================
APP_NAME=MyApp
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:3000
APP_PORT=3000

# ===============================
# Database
# ===============================
DB_HOST=localhost
DB_PORT=5432
`;

    fs.writeFileSync(templatePath, content);
    const vars = parseEnvTemplate(templatePath);

    expect(vars).toContain('APP_NAME');
    expect(vars).toContain('APP_ENV');
    expect(vars).toContain('APP_DEBUG');
    expect(vars).toContain('APP_URL');
    expect(vars).toContain('APP_PORT');
    expect(vars).toContain('DB_HOST');
    expect(vars).toContain('DB_PORT');
    expect(vars.length).toBe(7);
  });

  it('should skip empty lines and comments', () => {
    const content = `# Comment line

APP_NAME=MyApp
# Another comment
APP_ENV=development
`;

    fs.writeFileSync(templatePath, content);
    const vars = parseEnvTemplate(templatePath);

    expect(vars).toEqual(['APP_NAME', 'APP_ENV']);
  });

  it('should handle empty file', () => {
    fs.writeFileSync(templatePath, '');
    const vars = parseEnvTemplate(templatePath);

    expect(vars).toEqual([]);
  });

  it('should only match valid environment variable names', () => {
    const content = `APP_NAME=value
lowercase_name=value
123_INVALID=value
_VALID_NAME=value
VALID_123=value
`;

    fs.writeFileSync(templatePath, content);
    const vars = parseEnvTemplate(templatePath);

    // Only APP_NAME, _VALID_NAME, and VALID_123 should match
    expect(vars).toContain('APP_NAME');
    expect(vars).toContain('_VALID_NAME');
    expect(vars).toContain('VALID_123');
    expect(vars.length).toBe(3);
  });

  it('should throw error when file cannot be read', () => {
    const nonExistentPath = path.join(tempDir, 'non-existent-file.txt');
    
    expect(() => parseEnvTemplate(nonExistentPath)).toThrow(/Failed to read env template file/);
  });

  it('should include file path in error message when read fails', () => {
    const nonExistentPath = path.join(tempDir, 'non-existent-file.txt');
    
    expect(() => parseEnvTemplate(nonExistentPath)).toThrow(nonExistentPath);
  });
});

describe('findEnvTemplate', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sandboxed-test-'));
  });

  afterEach(() => {
    // Clean up temp directory recursively and forcefully
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('should find .env.template file when it exists', () => {
    const templatePath = path.join(tempDir, '.env.template');
    fs.writeFileSync(templatePath, 'APP_NAME=test');

    const found = findEnvTemplate(tempDir);
    expect(found).toBe(templatePath);
  });

  it('should return null when .env.template does not exist', () => {
    const found = findEnvTemplate(tempDir);
    expect(found).toBeNull();
  });
});
