import { Router } from 'express';
import { healthRouter } from './health';
import plansRouter from './plans';
import productsRouter from './products';
import { authRouter } from '../../routes/auth.routes';
import { inventoryRouter } from '../../routes/inventory.routes';
import usersRouter from '../../routes/users.routes';
import rolesRouter from '../../routes/roles.route';

export function buildApiRouter() {
  const router = Router();

  router.use(healthRouter());
  router.use(plansRouter);
  router.use(productsRouter);
  router.use('/auth', authRouter());
  router.use(inventoryRouter());
  router.use('/users', usersRouter);
  router.use('/roles', rolesRouter);

  return router;
}

export default buildApiRouter;
