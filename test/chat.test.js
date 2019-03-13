const config = require('config');
const colors = require('colors');
const assert = require('assert');
const server = require('../server');


describe('chat tests', () => {
  before((done) => {
    const serverPort = config.get('serverPort');

    server.listen(serverPort, () => {
      console.log(colors.blue(`Testing server is successfully running on port ${serverPort}`));
      done();
    });
  });

  after((done) => {
    server._close(done);
  });

  describe('publish message', () => {
    it('strict publish message', (done) => {
      assert.strictEqual(true, true);
    });
  });

});

