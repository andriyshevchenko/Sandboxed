# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-30

### Added
- Initial release of sandboxed CLI tool
- Cross-platform command execution (Windows, macOS, Linux)
- `.env.template` file parsing for environment variable names
- System keyring integration using `@napi-rs/keyring`
- Secure environment variable injection from OS credential store
- Commander.js-based CLI with help and version commands
- Comprehensive test suite with Jest
- GitHub Actions workflows for build and test on multiple platforms
- Support for Node.js 18.x and 20.x
- Comprehensive README documentation
- Security considerations and best practices documentation

### Security
- CodeQL security scanning with 0 alerts
- Minimal GitHub Actions permissions
- Secure credential storage using OS keyring
- Environment variable name validation (uppercase pattern)

[1.0.0]: https://github.com/andriyshevchenko/Sandboxed/releases/tag/v1.0.0
