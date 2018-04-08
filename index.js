#!/usr/bin/env node

const fs = require('fs');
const command = require('./command');

const find = path => {
  const files = fs.readdirSync(path).filter(f => f !== 'index.json');
  const commands = [];

  files.forEach(file => {
    const stat = fs.lstatSync(`${path}/${file}`);
    if (stat.isDirectory()) {
      const cmd = require(`${path}/${file}/index.json`);
      commands.push({
        ...cmd,
        ...{ name: file, commands: find(`${path}/${file}`) },
      });
    } else if (stat.isFile()) {
      const def = require(`${path}/${file}`);
      commands.push(def);
    }
  });

  return commands;
};
const commands = { name: 'root', commands: find('./commands') };
command.run(process.argv, commands);
