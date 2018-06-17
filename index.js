#!/usr/bin/env node

const fs = require('fs');
const command = require('./command');
const path = require('path');

if (fs.existsSync(path.join(process.cwd(), 'commands.json'))) {
  const commands = {
    name: 'root',
    commands: require(path.join(process.cwd(), 'commands')).commands,
  };
  command.run(process.argv, commands);
}
