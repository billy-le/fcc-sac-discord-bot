import express from 'express';

const router = express.Router();

router.get('/', (_req, res) => {
    res.render('index');
});

router.post('/', (req, res) => {
    console.log(req.body);

    res.end();
});

export default router;
