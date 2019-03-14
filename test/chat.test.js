const path = require('path');
const axios = require('axios');
const fse = require('fs-extra');
const config = require('config');
const colors = require('colors');
const assert = require('assert');
const server = require('../server');

let testSrv;
const testSrvPort = config.get('serverPort');
const testSrvUrl = `http://localhost:${testSrvPort}`;

assert.strictEqual(process.env.NODE_ENV, 'test');

describe('chat tests', () => {
  const XHRPublish = (data) => axios({
    data,
    method: 'POST',
    url: `${testSrvUrl}/publish`,
    headers: {'content-type': 'application/json;charset=utf-8'},
  });

  before((done) => {
    testSrv = server.listen(testSrvPort, () => {
      console.log(colors.blue(
        `Testing server is successfully running on port ${testSrvPort}`
      ));
      done();
    });
  });

  after((done) => {
    testSrv.close(() => {
      console.log(colors.blue('Testing server is closed'));
      done();
    });
  });

  describe('publish', () => {
    it('publish message', async () => {
      const response = await XHRPublish(JSON.stringify({message: 'test'}));

      assert.strictEqual(response.status, 200);
    });

    it('publish message with invalid data', (done) => {
      const invalidMessage = '[invalid';

      XHRPublish(invalidMessage).catch((e) => {
        assert.strictEqual(e.response.status, 400);
        assert.strictEqual(e.response.data, `Bad request ${invalidMessage}`);
        done();
      });
    });

    it('publish message with big data', (done) => {
      const bigJsonFile = fse.readFileSync(
        path.join(config.get('fixturesRoot'), 'big.json'),
        {encoding: 'utf-8'}
      );

      XHRPublish(bigJsonFile).catch((e) => {
        assert.strictEqual(e.response.status, 413);
        assert.strictEqual(e.response.data, `Too large`);
        done();
      });
    });
  });

  it('subscribe', (done) => {
    axios({
      method: 'POST',
      url: `${testSrvUrl}/subscribe`,
    }).then(({ data, status }) => {
      assert.strictEqual(status, 200);
      assert.strictEqual(data, 'test');
      done();
    });

    XHRPublish(JSON.stringify({message: 'test'}));
  });

});

