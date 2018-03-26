const shell = require('shelljs');
const chalk = require('chalk');

const exec = (cmd, path) => {
  const script = `
      # cd ${path}
      ${cmd}
  `;
  console.log(`${chalk.bgMagenta.black(cmd)}`);
  const execution = shell.exec(script);
  process.exitCode = execution.code;
  return execution;
};

module.exports = {
  exec,
};
