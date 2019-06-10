import express from 'express';

import homeRoute from './home';
import webhookRoutes from './webhook';
import oauthRoutes from './oauth';

const router = express.Router();

router.use('/', homeRoute);
router.use('/', webhookRoutes);
router.use('/', oauthRoutes);

export default router;
