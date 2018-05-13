var Koa = require('koa');
var Router = require('koa-router');
const fetch = require('node-fetch');

var app = new Koa();
var router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'hello world';
});

router.get('/symbols', async ctx => {
  const res = await fetch('https://api.bitfinex.com/v1/symbols');
  ctx.body = await res.json();
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3001);
