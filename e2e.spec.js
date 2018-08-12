const shell = require('child_process');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');

const TEMP_DIR = 'commands/tests';

const createJson = (fileName, content) =>
  fs.outputJson(`${TEMP_DIR}/${fileName}`, content, { spaces: 2 });

const runDeva = () => exec(`cd ${TEMP_DIR} && node ../../index.js`);

beforeEach(async () => {
  await fs.remove(TEMP_DIR);
  await fs.ensureDir(TEMP_DIR);
});

it('defines commands', async () => {
  await createJson('commands.json', {
    name: 'deva',
    commands: [
      {
        name: 'command1',
        alias: 'c1',
        exec: 'npm run test'
      },
      {
        name: 'command2',
        alias: 'c2',
        exec: 'npm run test'
      }
    ]
  });

  const { stdout } = await runDeva();

  expect(stdout).toContain('command1|c1');
  expect(stdout).toContain('command2|c2');
});

it('output message when commands.json is absent', async () => {
  let message = '';
  try {
    await runDeva();
  } catch ({ stderr }) {
    message = stderr;
  }

  expect(message).toContain('error: commands.json file not found');
});

it('uses package.json to generate commands when commands.json is absent', async () => {
  await createJson('package.json', {
    scripts: { test: 'mocha' }
  });

  const {stdout} = await runDeva();

  expect(stdout).toContain('test');
});
