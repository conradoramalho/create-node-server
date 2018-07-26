import Koa from 'koa';
import cors from 'kcors';
import router from './routes';
import config from './config';

const api = new Koa();

api.use(
  cors({
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE',
    allowHeaders: ['Content-Type', 'Authorization'],
  })
);

api.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log({
      query: ctx.request.query,
      action: ctx.request.originalUrl,
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.body,
      ...error,
    });

    const { statusCode, status, message } = error;

    ctx.status = statusCode || status || 500;

    ctx.body = {
      error: message,
    };
  }
});

api.use(router);

api.listen(config.port, () => console.log(`running at ${config.port}`));