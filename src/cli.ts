#!/usr/bin/env node

import { Command } from 'commander';
import { executeSandboxedCommand } from './executor';

const program = new Command();

program
  .name('sandboxed')
  .description('Execute commands with environment variables from keyring')
  .version('1.0.0')
  .argument('<command...>', 'Command to execute')
  .action(async (commandArgs: string[]) => {
    try {
      const command = commandArgs.join(' ');
      await executeSandboxedCommand(command);
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
