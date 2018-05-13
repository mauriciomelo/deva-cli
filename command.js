const program = require('commander');
const isFunction = require('lodash.isfunction');
const executor = require('./executor');
const chalk = require('chalk');

let wasActionCalled = false;

const optionsAsArgs = (options = []) =>
  options.map(option => {
    const argument = option.argument ? ` ${option.argument}` : '';
    const flags = `-${option.alias}, --${option.name}${argument}`;
    return [flags, option.description];
  });

const parseOptionFor = (command, options, position) =>
  command.options &&
  command.options
    .filter(option => options[option.name] && option[position])
    .map(option =>
      option[position].replace(`\${${option.name}}`, options[option.name])
    )
    .join(' ');

const actionFor = command => options => {
  if (isFunction(command.exec)) {
    return command.exec(program);
  }
  wasActionCalled = true;

  const prepend = parseOptionFor(command, options, 'prepend');
  const append = parseOptionFor(command, options, 'append');

  const finelCmdString = [prepend, command.exec, append]
    .filter(Boolean)
    .join(' ');
  executor.exec(finelCmdString, command.path || '.');
};

const add = command => {
  const cmd = program
    .command(command.name)
    .alias(command.alias)
    .description(command.description)
    .action(actionFor(command));

  optionsAsArgs(command.options).forEach(args => cmd.option(...args));
};

const hasExecuted = () => wasActionCalled;

const displayHelp = () => program.help();
const parse = args => program.parse(args);

const findMatch = (args, command, path) => {
  const excutionPath = command.path || path;
  const childCommand =
    Array.isArray(command.commands) &&
    command.commands.find(c => c.name === args[1] || (c.alias === args[1] && c.alias));
  if (childCommand) {
    return findMatch(args.slice(1), childCommand, excutionPath);
  }
  return { command: {...command, ...{path: excutionPath}}, args };
};

const run = (argv, defs) => {
  const { command, args } = findMatch([...['root'], ...argv.slice(2)], defs);

  let isRoot = false;
  if (Array.isArray(command.commands)) {
    command.commands.forEach(add);
    isRoot = true;
  } else {
    add(command);
  }
  const parsedArgs = [
    ...argv.slice(0, 2),
    ...args.filter(a => !isRoot || a !== command.name),
  ];

  program.parse(parsedArgs);

  const hasNoCommand = parsedArgs.length < 3;

  if (hasNoCommand) {
    displayHelp();
  } else if (!hasExecuted()) {
    console.error(chalk.red(`error: unknown command`));
    process.exit(1);
  }
};

module.exports = {
  run,
};
