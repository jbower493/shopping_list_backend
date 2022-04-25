// import db
const db = require('../config/db/db');

module.exports = {

    async create(req, res, next) {
        const { name } = req.body;

        // Validate reuqest body
        if (!name) return res.status(400).json({ error: 'List name is required.' });

        try {
            const results = await db.pQuery('INSERT INTO list (name, user_id) VALUES (?, ?)', [name, req.user.id]);
            console.log(results)
            res.json({ message: 'Successfully created new list.' });
        } catch (e) {
            return next(e);
        }
    },

};