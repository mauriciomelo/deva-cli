const program = require('commander');
const isFunction = require('lodash.isfunction');
const executor = require('./executor');

let wasActionCalled = false;

const optionsAsArgs = (options = []) =>
  options.map(option => {
    const argument = option.argument ? ` ${option.argument}` : '';
    const flags = `-${option.short}, --${option.long}${argument}`;
    return [flags, option.description];
  });

const actionFor = command => options => {
  if (isFunction(command.exec)) {
    return command.exec(program);
  }
  wasActionCalled = true;
  const prepend =
    command.options &&
    command.options
      .filter(option => options[option.long] && option.prepend)
      .map(option =>
        option.prepend.replace(`\${${option.long}}`, options[option.long])
      )
      .join(' ');

  const finelCmdString = [prepend, command.exec].filter(Boolean).join(' ');

  executor.exec(finelCmdString);
};

const add = command => {
  program
    .command(command.long)
    .alias(command.short)
    .description(command.description)
    .action(actionFor(command));

  optionsAsArgs(command.options).forEach(args => program.option(...args));
};

const hasExecuted = () => wasActionCalled;

const displayHelp = () => program.help();
const parse = args => program.parse(args);

module.exports = {
  add,
  hasExecuted,
  displayHelp,
  parse,
};
