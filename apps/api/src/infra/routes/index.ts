import { Router } from 'express';
import { auditRouter } from '../../routes/audit.routes';
import healthRouter from './health';

const router = Router();
router.use(healthRouter);
router.use('/audit', auditRouter());

export default router;