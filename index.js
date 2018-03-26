const fs = require('fs');
const chalk = require('chalk');
const command = require('./command');

const parents = [];

const executeChildren = (path, currentFile, argv) => program => {
  parents.push(currentFile);
  program.commands = [];
  const args = argv.filter(arg => !parents.includes(arg));
  findDefinitions(`${path}/${currentFile}`, args);
};

const findDefinitions = (path, argv) => {
  const files = fs.readdirSync(path).filter(f => f !== 'index.json');

  files.forEach(file => {
    const stat = fs.lstatSync(`${path}/${file}`);
    if (stat.isDirectory()) {
      const cmd = require(`${path}/${file}/index.json`);
      command.add({
        ...cmd,
        ...{ long: file, exec: executeChildren(path, file, argv) },
      });
    } else if (stat.isFile()) {
      const def = require(`${path}/${file}`);
      command.add(def);
    }
  });

  command.parse(argv);

  const hasNoCommand = () => process.argv.length < 3;

  if (hasNoCommand()) {
    command.displayHelp();
  } else if (!command.hasExecuted()) {
    console.error(chalk.red(`error: unknown command`));
    process.exit(1);
  }
};

findDefinitions('./commands', process.argv);
