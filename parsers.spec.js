const parsers = require('./parsers');

describe('npm parser', () => {
  it('creates a command for each script entry', () => {
    const packageJson = {
      scripts: { test: '', dance: '' }
    };

    const root = parsers.npmParser(packageJson);

    expect(root).toEqual({
      name: 'root',
      commands: [
        { name: 'test', exec: 'npm run test' },
        { name: 'dance', exec: 'npm run dance' }
      ]
    });
  });

  it('returns an empty array of commands when there is no scripts property', () => {
    const packageJson = {};

    const root = parsers.npmParser(packageJson);

    expect(root).toEqual({
      name: 'root',
      commands: []
    });
  });
});
