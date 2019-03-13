const path = require('path');

const rootFolder = process.cwd();

module.exports = {
  serverPort: 8081,
  publicRoot: path.join(rootFolder, 'public'),
  modulesRoot: path.join(rootFolder, 'modules')
};
