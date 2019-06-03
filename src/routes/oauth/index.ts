import express from 'express';
import routes from './meetup';

const router = express.Router();

router.use('/', routes);

export default router;
