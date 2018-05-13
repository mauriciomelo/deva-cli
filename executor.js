const chalk = require('chalk');
const shell = require('child_process');

const exec = (cmd, path) => {
  const script = `
      cd ${path}
      ${cmd}
  `;
  console.log(`> ${cmd}`);
  try {
    shell.execSync(script, {stdio: 'inherit'});
  } catch (e) {
    process.exitCode = e.status;
  }
};

module.exports = {
  exec,
};
