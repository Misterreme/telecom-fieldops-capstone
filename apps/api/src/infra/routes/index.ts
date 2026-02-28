import { Router } from 'express';
import { healthRouter } from './health';
import { authRouter } from '../../routes/auth.routes';
import { inventoryRouter } from '../../routes/inventory.routes';
import plansRouter from '../../routes/plans.routes';
import productsRouter from '../../routes/products.routes';
import usersRouter from '../../routes/users.routes';
import rolesRouter from '../../routes/roles.route';

export function buildApiRouter() {
  const router = Router();

  router.use(healthRouter());
  router.use('/catalog', plansRouter);
  router.use('/catalog', productsRouter);
  router.use('/auth', authRouter());
  router.use(inventoryRouter());
  router.use('/users', usersRouter);
  router.use('/roles', rolesRouter);

  return router;
}

export default buildApiRouter;
