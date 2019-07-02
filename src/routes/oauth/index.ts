import express from 'express';
import meetupRoutes from './meetup';

const router = express.Router();

router.use('/meetup', meetupRoutes);

export default router;
