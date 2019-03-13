const fs = require('fs');
const path = require('path');
const config = require('config');
const Router = require('koa-router');
const chat = require(path.join(config.get('modulesRoot'), 'chat'));

const router = new Router();

// GET
router.get('/', (ctx, next) => {
  const pathToIndex = path.join(config.get('publicRoot'), 'index.html');

  ctx.set('content-type', 'text/html');
  ctx.body = fs.createReadStream(pathToIndex);
});

// POST
router
  .post('/publish', async (ctx, next) => {
    const { status, body } = await chat.publish(ctx);

    ctx.body = body;
    ctx.status = status;
  })
  .post('/subscribe', async (ctx, next) => {
    const message = await chat.subscribe(ctx);

    ctx.status = 200;
    ctx.body = message;
  });

module.exports = router;
