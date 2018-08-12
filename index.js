#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const command = require('./command');
const { devaParser, npmParser } = require('./parsers');

if (fs.existsSync(path.join(process.cwd(), 'commands.json'))) {
  devaParser(require(path.join(process.cwd(), 'commands.json')))
    .then(root => command.run(process.argv, root))
    .catch(function(err) {
      console.error(err);
    });
} else if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
  const root = npmParser(require(path.join(process.cwd(), 'package.json')));
  command.run(process.argv, root);
} else {
  console.error(chalk.red(`error: commands.json file not found`));
  process.exitCode = 1;
}
