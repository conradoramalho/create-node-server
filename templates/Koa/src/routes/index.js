import koaCompose from 'koa-compose';
import usersRoutes from './users';

const middlewares = [usersRoutes.middleware()];

export default koaCompose([...middlewares]);
