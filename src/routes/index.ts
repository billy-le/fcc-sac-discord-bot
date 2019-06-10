import express from 'express';

import homeRoute from './home';
import webhookRoutes from './webhook';
import oauthRoutes from './oauth';
import loginRoutes from './login';

const router = express.Router();

router.use('/', homeRoute);
router.use('/', webhookRoutes);
router.use('/', oauthRoutes);
router.use('/', loginRoutes);

export default router;
