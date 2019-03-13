const config = require('config');
const colors = require('colors');
const server = require('./server');

const PORT = config.get('serverPort');

server.listen(PORT, () => {
  console.log(colors.green(`Server is successfully running on port ${PORT}`));
});
