// import dependencies
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

// import db
const db = require('../config/db/db');

module.exports = {

    register(req, res, next) {
        const { username, password } = req.body;

        const hash = bcrypt.hashSync(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err, results) => {
            if (err) {
                return next(err);
            }
            res.json({ message: 'user successfully created.' });
        });
    },

    getUser(req, res, next) {
        if (req.user) {
            res.json({ user: { username: req.user.username } });
        } else {
            res.status(401).json({ error: 'No user is logged in.' });
        }
    },

    login(req, res, next) {
        const { username, password } = req.body;

        const errors = [];

        if (!username || !password) {
            errors.push('Field(s) missing');
        }
        if (typeof username !== 'string' || typeof password !== 'string') {
            errors.push('Not strings');
        }

        if (errors.length > 0) {
            return res.status(400).json({ error: errors[0] });
        }

        db.query('SELECT * FROM users WHERE username = ?', [username], async (err, users) => {
            if (err) {
                throw err;
            }

            if (users.length === 0) {
                return res.status(401).json({ message: 'Incorrect credentials.' });
            }

            try {
                const matches = await bcrypt.compare(password, users[0].password);
                if (matches) {

                    const newSessionId = uuidv4();
                    const userId = users[0].id;

                    db.query('INSERT INTO auth (session_id, user_id) VALUES (?, ?)', [newSessionId, userId], (err, results) => {
                        if (err) next(err);

                        res.json({ message: 'Log in successful.', token: newSessionId });
                    });

                } else {
                    res.status(401).json({ message: 'Incorrect credentials.' });
                }
            } catch (err) {
                next(err);
            }

        });
    },

    logout(req, res, next) {
        if (!req.user) return res.json();

        const bearerToken = req.get('Authorization')?.split(' ')[1];

        db.query('DELETE FROM auth WHERE session_id = ?', [bearerToken], (err, results) => {
            if (err) return next(err);

            res.json({ message: 'Successfully logged out.' });
        });
    },

    deserializeUser(req, res, next) {
        const bearerToken = req.get('Authorization')?.split(' ')[1];

        // If no bearer token, do nothing
        if (!bearerToken) return next();

        // Find the auth session in the auth table
        db.query('SELECT user_id FROM auth WHERE session_id = ?', [bearerToken], (err, results) => {
            if (err) throw err;

            const user_id = results[0]?.user_id;

            // If theres no DB entry for the session_id then there is no logged in user, so do nothing
            if (!user_id) return next();

            // If there is a logged in user, fetch the rest of that user's data and add it to req.user
            db.query('SELECT * FROM users WHERE id = ?', [user_id], (err, results) => {
                if (err) throw err;

                req.user = results[0];
                next();
            });
        });
    }
};