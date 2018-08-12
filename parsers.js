const $RefParser = require('json-schema-ref-parser');

const devaParser = commands => {
  return $RefParser
    .dereference(Object.assign({}, {}, commands))
    .then(function(schema) {
      return {
        name: 'root',
        commands: schema.commands
      };
    });
};

const npmParser = ({ scripts = {} }) => {
  const commands = Object.keys(scripts).map(name => ({
    name,
    exec: `npm run ${name}`
  }));

  return {
    name: 'root',
    commands
  };
};

module.exports = {
  devaParser,
  npmParser
};
