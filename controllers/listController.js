// import db
const db = require('../config/db/db');

module.exports = {

    async allLists(req, res, next) {
        try {
            const allLists = await db.pQuery('SELECT id, name FROM list WHERE user_id = ?', [req.user.id]);
            res.json({ lists: allLists });
        } catch (e) {
            return next(e);
        }
    },

    async create(req, res, next) {
        const { name } = req.body;

        // Validate reuqest body
        if (!name) return res.status(400).json({ error: 'List name is required.' });

        try {
            await db.pQuery('INSERT INTO list (name, user_id) VALUES (?, ?)', [name, req.user.id]);
            res.json({ message: 'Successfully created new list.' });
        } catch (e) {
            if (e.code === 'ER_DUP_ENTRY') return res.status(404).json({ error: 'List already exists.' });
            return next(e);
        }
    },

    async info(req, res, next) {
        const { id } = req.params;
        
        res.json({ list: { name: 'The test list', items: ['milk', 'bread', 'choco'] } })
    },

    async edit(req, res, next) {
        const { id } = req.params;
        const { name } = req.body;
        
        try {
            const results = await db.pQuery('UPDATE list SET name = ? WHERE id = ?', [name, id]);

            if (results.affectedRows === 0) return res.status(404).json({ error: 'No list with the provided id exists.' });
            res.json({ message: 'Successfully updated list.' });
        } catch (e) {
            return next(e);
        }
    },

    async delete(req, res, next) {
        const { id } = req.params;
        
        try {
            const results = await db.pQuery('DELETE FROM list WHERE id = ?', [id]);

            if (results.affectedRows === 0) return res.status(404).json({ error: 'No list with the provided id exists.' });
            res.json({ message: 'Successfully deleted list.' });
        } catch (e) {
            return next(e);
        }
    }

};