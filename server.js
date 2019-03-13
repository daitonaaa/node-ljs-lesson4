const Koa = require('koa');
const router = require('./router');

const server = new Koa();

server.use(router.routes());

module.exports = server;
