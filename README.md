# Sandboxed

A cross-platform CLI tool that executes commands with environment variables securely loaded from the system keyring.

## Features

- 🔐 Secure environment variable storage using system keyring
- 🌐 Cross-platform support (Windows, macOS, Linux)
- 📝 Template-based configuration with `.env.template`
- 🚀 Simple CLI interface

## Installation

```bash
npm install -g @mcborov01/sandboxed
```

Or install locally in your project:

```bash
npm install --save-dev @mcborov01/sandboxed
```

## Usage

### Basic Usage

```bash
sandboxed <your-command>
```

For example:

```bash
sandboxed dotnet run
sandboxed npm start
sandboxed python app.py
```

### How It Works

1. **Template File**: Create a `.env.template` file in your project root with the environment variable names you need:

```env
# ===============================
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
DB_USER=postgres
DB_PASSWORD=secret
```

**Note**: Environment variable names must follow the standard convention: uppercase letters, digits, and underscores; must start with an uppercase letter or underscore (e.g., `APP_NAME`, `_INTERNAL_VAR`, `VAR_123`).

2. **Store Credentials**: Store the actual values in your system keyring. The tool uses the service name `sandboxed` and the environment variable name as the account/username.

   For example, on macOS/Linux, you can use the keychain/keyring tools, or programmatically:
   
   ```typescript
   import { Entry } from '@napi-rs/keyring';
   
   const entry = new Entry('sandboxed', 'DB_PASSWORD');
   entry.setPassword('my-secret-password');
   ```

3. **Run Your Command**: When you run `sandboxed <command>`, it will:
   - Look for `.env.template` in the current directory
   - Parse all environment variable names from the template
   - Retrieve values from the system keyring
   - Set the environment variables for the command
   - Execute your command with those variables available

### Example Workflow

```bash
# 1. Create your template file
cat > .env.template << EOF
APP_NAME=MyApp
DATABASE_URL=postgres://localhost/mydb
API_KEY=placeholder
EOF

# 2. Store your secrets (using a helper script or manually via keyring)
# This is typically done once per machine

# 3. Run your application
sandboxed npm start

# Your application will have access to APP_NAME, DATABASE_URL, and API_KEY
# environment variables with the values from the keyring
```

## Platform-Specific Notes

### Windows
On Windows, credentials are stored in the Windows Credential Manager.

### macOS
On macOS, credentials are stored in the Keychain.

### Linux
On Linux, credentials are stored in the Secret Service API (typically provided by GNOME Keyring or KWallet).

## Security Considerations

- **Command Execution**: This tool executes commands provided by the user directly through the system shell. It is designed for developer convenience and should only be used with commands from trusted sources. Shell metacharacters (pipes, redirects, etc.) are processed by the shell.
- **Keyring Access**: The tool retrieves credentials from your system keyring. Ensure your keyring is properly secured with a strong password.
- **Environment Variables**: Environment variables are passed to child processes. Be aware that some programs may log or expose environment variables.
- **Template Files**: Never commit actual secrets to `.env.template` files. Use them only for documentation and variable names.
- **Credential Storage**: Each user/machine maintains their own keyring entries. Credentials are stored securely by the operating system's credential management system.
- **Variable Naming**: Only variables matching the pattern `[A-Z_][A-Z0-9_]*` are parsed from the template file. This prevents accidental parsing of invalid environment variable names.

## Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/andriyshevchenko/Sandboxed.git
cd Sandboxed

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test
```

### Running Tests

```bash
npm test
```

## Security

- Never commit actual secrets to your repository
- Use `.env.template` only for documentation and variable names
- Actual values are stored securely in your system's keyring
- Each machine/user maintains their own keyring entries

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
