#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const command = require('./command');

if (fs.existsSync(path.join(process.cwd(), 'commands.json'))) {
  const commands = {
    name: 'root',
    commands: require(path.join(process.cwd(), 'commands')).commands,
  };
  command.run(process.argv, commands);
} else {
  console.error(chalk.red(`error: commands.json file not found`));
  process.exitCode = 1;
}
