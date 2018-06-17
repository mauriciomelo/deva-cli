#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const command = require('./command');
const $RefParser = require('json-schema-ref-parser');

if (fs.existsSync(path.join(process.cwd(), 'commands.json'))) {
  const commands = require(path.join(process.cwd(), 'commands.json'));
  $RefParser
    .dereference(Object.assign({}, {}, commands))
    .then(function(schema) {
      const root = {
        name: 'root',
        commands: schema.commands,
      };
      command.run(process.argv, root);
    })
    .catch(function(err) {
      console.error(err);
    });
} else {
  console.error(chalk.red(`error: commands.json file not found`));
  process.exitCode = 1;
}
