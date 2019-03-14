const path = require('path');

const rootFolder = process.cwd();

module.exports = {
  serverPort: 3447,
  fixturesRoot: path.join(rootFolder, 'test', 'fixtures'),
};
