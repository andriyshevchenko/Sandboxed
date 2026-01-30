#!/usr/bin/env node

import { Command } from 'commander';
import { executeSandboxedCommand } from './executor';
import { version } from '../package.json';

const program = new Command();

program
  .name('sandboxed')
  .description('Execute commands with environment variables from keyring')
  .version(version)
  .argument('<command...>', 'Command to execute')
  .action(async (commandArgs: string[]) => {
    const command = commandArgs.join(' ');
    try {
      await executeSandboxedCommand(command);
    } catch (error) {
      console.error(`Error while executing sandboxed command "${command}":`, error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
