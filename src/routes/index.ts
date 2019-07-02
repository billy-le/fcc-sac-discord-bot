import express from 'express';

import homeRoute from './home';
import webhookRoutes from './webhook';
import oauthRoutes from './oauth';
import githubAppRoutes from './github-app';

const router = express.Router();

router.use('/', homeRoute);
router.use('/webhook', webhookRoutes);
router.use('/oauth', oauthRoutes);
router.use('/github-app', githubAppRoutes);

export default router;
