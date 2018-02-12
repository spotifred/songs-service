require('dotenv').config();
require('newrelic');
const Koa = require('koa');
const Parser = require('koa-body');
const responseTime = require('koa-response-time');

const app = new Koa();
const router = require('./routes.js');

const PORT = process.env.PORT; // could do productionPort || 3000 as needed

app
  .use(responseTime())
  .use(Parser())
  .use(router.router.routes())
  .use(router.router.allowedMethods());

if (!module.parent) {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
}
