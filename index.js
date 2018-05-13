const Koa = require('koa');
const Router = require('koa-router');
const fetch = require('node-fetch');
const websockify = require('koa-websocket');

const sockets = require('./sockets');

const app = websockify(new Koa());
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = 'hello world';
});

router.get('/symbols', async ctx => {
  const res = await fetch('https://api.bitfinex.com/v1/symbols');
  ctx.body = await res.json();
});

router.get('/tickers', async ctx => {
  console.log(ctx.query.symbols);
  const res = await fetch(
    `https://api.bitfinex.com/v2/tickers?symbols=${ctx.query.symbols}`,
  );
  ctx.body = await res.json();
});

app.use(router.routes()).use(router.allowedMethods());
app.ws.use(sockets.routes()).use(sockets.allowedMethods());

app.listen(3001);
