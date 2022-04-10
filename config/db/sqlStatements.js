module.exports = {

    createUsersTable: 'CREATE TABLE IF NOT EXISTS users (id INT NOT NULL AUTO_INCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY (id))',

    createAuthTable: 'CREATE TABLE IF NOT EXISTS auth (id INT NOT NULL AUTO_INCREMENT, auth_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id))',
    
};