const program = require('commander');
const command = require('./command');
const executor = require('./executor');

let options;

describe('command', () => {
  beforeEach(() => {
    executor.exec = jest.fn();
    program.help = jest.fn();
    program.parse = jest.fn();
    program.command = jest.fn().mockReturnValue(program);
    program.alias = jest.fn().mockReturnValue(program);
    program.description = jest.fn().mockReturnValue(program);
    program.option = jest.fn().mockReturnValue(program);
    program.option = jest.fn().mockReturnValue(program);

    program.action = cb => {
      cb(options);
      return program;
    };
  });

  describe('#parse()', () => {
    it('parse args', () => {
      command.parse('args');
      expect(program.parse).toBeCalledWith('args');
    });
  });

  describe('#displayHelp()', () => {
    it('displays help', () => {
      command.displayHelp();
      expect(program.help).toBeCalled();
    });
  });

  describe('#hasExecuted()', () => {
    it('is false if no command was executed', () => {
      expect(command.hasExecuted()).toBe(false);
    });
    it('is true if any command was executed', () => {
      const exec = 'npm run sometask';
      command.add({ exec }); // our mock autoexecutes the added comand
      expect(command.hasExecuted()).toBe(true);
    });
  });

  describe('#add()', () => {
    it('sets the command long name', () => {
      const long = 'long name';
      command.add({ long });
      expect(program.command).toBeCalledWith(long);
    });

    it('sets the command short name (alias)', () => {
      const short = 'short name';
      command.add({ short });
      expect(program.alias).toBeCalledWith(short);
    });

    it('sets the command description', () => {
      const description = 'imagine an informative description here';
      command.add({ description });
      expect(program.description).toBeCalledWith(description);
    });

    it('sets the command to be executed', () => {
      const exec = 'npm run sometask';
      command.add({ exec });
      expect(executor.exec).toBeCalledWith(exec);
    });

    it('resolves options if provided', () => {
      options = { theOption: 'optionValue' };

      command.add({
        exec: 'npm run sometask',
        options: [
          {
            long: 'theOption',
            prepend: 'SOMETHING=${theOption}',
          },
        ],
      });
      expect(executor.exec).toBeCalledWith(
        'SOMETHING=optionValue npm run sometask'
      );
    });

    it('adds options of the commands', () => {
      command.add({
        exec: 'npm run sometask',
        options: [
          {
            long: 'test',
            short: 't',
            argument: '<@tags>',
            description: 'run the tests',
            prepend: 'SOMETHING=${theOption}',
          },
        ],
      });

      expect(program.option).toBeCalledWith(
        `-t, --test <@tags>`,
        'run the tests'
      );
    });
  });
});
