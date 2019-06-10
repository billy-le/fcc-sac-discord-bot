import express from 'express';

const router = express.Router();

router.get('/login', (_req, res) => {
    res.send(`
        <div id="app">
            <h1>Login</h1>
            <form>
                <input type="text placeholder="Enter username" />
                <input type="submit" />
            </form>
        </div>
    `);
});

export default router;
