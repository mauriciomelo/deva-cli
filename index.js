const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const program = require('commander');

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

let executed = false;

const parents = [];
const findDefinitions = (path, argv) => {
  const files = fs.readdirSync(path).filter(f => f !== 'index.json');

  files.forEach(file => {
    const stat = fs.lstatSync(`${path}/${file}`);
    if (stat.isDirectory()) {
      const cmd = require(`${path}/${file}/index.json`);
      program
        .command(file)
        .description(cmd.description)
        .action(() => {
          parents.push(file);
          program.commands = [];
          const args = argv.filter(arg => !parents.includes(arg));
          findDefinitions(`${path}/${file}`, args);
        });
    }

    if (stat.isFile()) {
      const command = require(`${path}/${file}`);
      const cmd = program
        .command(command.long)
        .alias(command.short)
        .description(command.description)
        .action(options => {
          executed = true;
          const prepend = command.options
            .filter(option => options[option.long] && option.prepend)
            .map(option =>
              option.prepend.replace(
                `\${${option.long}}`,
                options[option.long],
              ),
            )
            .join(' ');

          exec(`${prepend} ${command.exec}`);
        });

      command.options.forEach(option => {
        const argument = option.argument ? ` ${option.argument}` : '';
        const flags = `-${option.short}, --${option.long}${argument}`;
        cmd.option(flags, option.description);
      });
    }
  });

  program.parse(argv);

  const hasNoCommand = () => program.args.length === 0;

  if (hasNoCommand()) {
    program.help();
  } else if (!executed) {
    console.error(chalk.red(`error: unknown command`));
    process.exit(1);
  }
};

findDefinitions('./commands', process.argv);
