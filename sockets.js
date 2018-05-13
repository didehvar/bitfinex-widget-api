const ws = require('ws');
const Router = require('koa-router');

const router = new Router();

router.get('/socket', async ctx => {
  const w = new ws('wss://api.bitfinex.com/ws/2');

  ctx.websocket.on('open', () => console.log('websocket open'));

  w.on('message', message => {
    switch (ctx.websocket.readyState) {
      case ws.OPEN:
        return ctx.websocket.send(message);
      case ws.CLOSED:
        return w.close();
      default:
        console.log('Unhandled readyState', ctx.websocket.readyState);
    }
  });

  const sendWhenReady = message => {
    if (w.readyState === ws.OPEN) return w.send(message);
    setTimeout(() => sendWhenReady(message), 100);
  };

  ctx.websocket.on('message', message => {
    sendWhenReady(message);
  });
});

module.exports = router;
