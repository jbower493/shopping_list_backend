let db;

if (process.env.NODE_ENV === 'test') {
    db = require('./dbTest');
} else if (process.env.NODE_ENV === 'dev') {
    db = require('./dbDev');
} else {
    db = require('./dbProd');
}

// wrap the standard db.query method in a promise and add it to db object as pQuery
db.pQuery = function (query, params) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) reject(err);
            resolve(results);
        })
    })
}

module.exports = db;