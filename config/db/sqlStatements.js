module.exports = {

    createUsersTable: 'CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT, username TEXT NOT NULL, password TEXT NOT NULL, PRIMARY KEY (id))',

    createAuthTable: 'CREATE TABLE IF NOT EXISTS auth (id INT NOT NULL AUTO_INCREMENT, session_id TEXT NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id))',

    createItemsTable: 'CREATE TABLE IF NOT EXISTS item (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, PRIMARY KEY (id))',

    createListsTable: 'CREATE TABLE IF NOT EXISTS list (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES user(id))',

    createRecipesTable: 'CREATE TABLE IF NOT EXISTS recipe (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES user(id))',
    
};