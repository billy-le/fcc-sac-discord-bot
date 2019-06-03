import express from 'express';
import webhookRoutes from './webhook';
import oauthRoutes from './oauth';

const router = express.Router();

router.use('/', webhookRoutes);
router.use('/', oauthRoutes);

export default router;
