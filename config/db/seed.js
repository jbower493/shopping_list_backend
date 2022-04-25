require('dotenv').config();
const db = require('./db');
const statements = require('./sqlStatements');

// Open connection
db.connect(async (err) => {
    if (err) throw err;
    console.log('DB connection opened')

    try {
        // Create all tables
        await db.pQuery(statements.createUsersTable);
        console.log('Users table created if it didn\'t already exist.');
        await db.pQuery(statements.createAuthTable);
        console.log('Auth table created if it didn\'t already exist.');
        await db.pQuery(statements.createItemsTable);
        console.log('Items table created if it didn\'t already exist.');
        await db.pQuery(statements.createListsTable);
        console.log('Lists table created if it didn\'t already exist.');
        await db.pQuery(statements.createRecipesTable);
        console.log('Recipes table created if it didn\'t already exist.');
    } catch (e) {
        throw e;
    }

    // Close connection
    db.end(err => {
        if (err) throw err;
        console.log('DB connection closed')
    });
});