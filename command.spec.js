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

  describe('#run()', () => {
    it('executes parents commands', () => {
      const defs = {
        name: 'root',
        commands: [
          {
            name: 'child',
            exec: 'npm run sub',
          },
          {
            name: 'child2',
            exec: 'npm run sub',
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);

      expect(program.command).toBeCalledWith('child');
      expect(program.command).toBeCalledWith('child2');
      expect(program.parse).toBeCalledWith(argv);
    });
    it('executes child commands', () => {
      const defs = {
        name: 'root',
        commands: [
          {
            name: 'parent',
            commands: [
              {
                name: 'child',
                exec: 'npm run sub',
              },
            ],
          },
        ],
      };
      const argv = [null, null, 'parent', 'child'];
      command.run(argv, defs);

      expect(program.command).toBeCalledWith('child');
      expect(program.parse).toBeCalledWith([null, null, 'child']);
    });
  });

  describe('#displayHelp()', () => {
    it('displays help', () => {
      command.displayHelp();
      expect(program.help).toBeCalled();
    });
  });

  describe('#add()', () => {
    it('sets the command name name', () => {
      const name = 'name name';
      command.add({ name });
      expect(program.command).toBeCalledWith(name);
    });

    it('sets the command alias name (alias)', () => {
      const alias = 'alias name';
      command.add({ alias });
      expect(program.alias).toBeCalledWith(alias);
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
            name: 'theOption',
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
            name: 'test',
            alias: 't',
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
