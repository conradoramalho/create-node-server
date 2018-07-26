import Router from 'koa-joi-router';
import controller from '../controllers/users';

const router = Router();

router.name = 'Users';
router.prefix('/users');

router.route([
  {
    meta: {
      swagger: {
        summary: 'Get user by id',
        description: 'Return user',
        tags: ['Users'],
      },
    },
    method: 'GET',
    path: '/:id',
    handler: [controller.getUser],
  }
]);

export default router;
