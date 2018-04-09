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

    it('sets the command name name', () => {
      const defs = {
        name: 'root',
        commands: [
          {
            name: 'command',
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);

      expect(program.command).toBeCalledWith('command');
    });

    it('sets the command alias name (alias)', () => {
      const defs = {
        name: 'root',
        commands: [
          {
            alias: 'alias',
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);
      expect(program.alias).toBeCalledWith('alias');
    });

    it('sets the command description', () => {
      const description = 'imagine an informative description here';
      const defs = {
        name: 'root',
        commands: [
          {
            description,
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);
      expect(program.description).toBeCalledWith(description);
    });

    it('sets the command to be executed', () => {
      const exec = 'npm run sometask';
      const defs = {
        name: 'root',
        commands: [
          {
            exec,
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);
      expect(executor.exec).toBeCalledWith(exec);
    });

    it('resolves options if provided', () => {
      options = { theOption: 'optionValue' };

      const defs = {
        name: 'root',
        commands: [
          {
            exec: 'npm run sometask',
            options: [
              {
                name: 'theOption',
                prepend: 'SOMETHING=${theOption}',
              },
            ],
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);

      expect(executor.exec).toBeCalledWith(
        'SOMETHING=optionValue npm run sometask'
      );
    });

    it('adds options of the commands', () => {
      const defs = {
        name: 'root',
        commands: [
          {
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
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);

      expect(program.option).toBeCalledWith(
        `-t, --test <@tags>`,
        'run the tests'
      );
    });

    it('displays help if no command provided', () => {
      const defs = {
        name: 'root',
        commands: [
          {
            name: 'command',
            exec: 'npm run sometask',
          },
        ],
      };
      const argv = [null, null];
      command.run(argv, defs);
      expect(program.help).toBeCalled();
    });
  });
});
