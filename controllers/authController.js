// import dependencies
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// import db
const db = require('../config/db/db');

module.exports = {

    async register(req, res, next) {
        const { username, password } = req.body;

        const hash = bcrypt.hashSync(password, 10);

        try {
            await db.pQuery('INSERT INTO user (username, password) VALUES (?, ?)', [username, hash]);
            res.json({ message: 'user successfully created.' });
        } catch (e) {
            next(e);
        }
    },

    getUser(req, res, next) {
        if (req.user) return res.json({ user: { username: req.user.username } });
        res.status(401).json({ error: 'No user is logged in.' });
    },

    async login(req, res, next) {
        const { username, password } = req.body;

        const errors = [];
        // Validate credentials
        if (!username || !password) errors.push('Field(s) missing');
        if (typeof username !== 'string' || typeof password !== 'string') errors.push('Not strings');

        if (errors.length > 0) return res.status(400).json({ error: errors[0] });

        // If there is a user with the provided username, try to log the user in
        try {
            const users = await db.pQuery('SELECT * FROM user WHERE username = ?', [username]);
            if (users.length === 0) return res.status(401).json({ error: 'Incorrect credentials.' });

            const matches = await bcrypt.compare(password, users[0].password);
            if (!matches) return res.status(401).json({ error: 'Incorrect credentials.' });

            const newSessionId = uuidv4();
            const userId = users[0].id;

            await db.pQuery('INSERT INTO auth (session_id, user_id) VALUES (?, ?)', [newSessionId, userId]);
            res.json({ message: 'Log in successful.', token: newSessionId });
        } catch (err) {
            next(err);
        }
    },

    async logout(req, res, next) {
        if (!req.user) return res.json();

        const bearerToken = req.get('Authorization')?.split(' ')[1];

        try {
            await db.pQuery('DELETE FROM auth WHERE session_id = ?', [bearerToken]);
            res.json({ message: 'Successfully logged out.' });
        } catch (e) {
            next(e);
        }
    },

    async deserializeUser(req, res, next) {
        const bearerToken = req.get('Authorization')?.split(' ')[1];
        // If no bearer token, do nothing
        if (!bearerToken) return next();

        try {
            // Find the auth session in the auth table
            const results = await db.pQuery('SELECT user_id FROM auth WHERE session_id = ?', [bearerToken])
            const user_id = results[0]?.user_id;
            // If theres no DB entry for the session_id then there is no logged in user, so do nothing
            if (!user_id) return next();
            // If there is a logged in user, fetch the rest of that user's data and add it to req.user
            const resultsTwo = await db.pQuery('SELECT * FROM user WHERE id = ?', [user_id]);
            req.user = resultsTwo[0];
            next();
        } catch (e) {
            next(e);
        }
    }
};