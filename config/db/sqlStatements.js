module.exports = {

    createUsersTable: 'CREATE TABLE IF NOT EXISTS user (id INT NOT NULL AUTO_INCREMENT, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL, PRIMARY KEY (id))',

    createAuthTable: 'CREATE TABLE IF NOT EXISTS auth (id INT NOT NULL AUTO_INCREMENT, session_id TEXT NOT NULL, user_id INT NOT NULL, PRIMARY KEY (id))',

    createItemsTable: 'CREATE TABLE IF NOT EXISTS item (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL UNIQUE, PRIMARY KEY (id))',

    createListsTable: 'CREATE TABLE IF NOT EXISTS list (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL UNIQUE, user_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES user(id))',

    createRecipesTable: 'CREATE TABLE IF NOT EXISTS recipe (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL UNIQUE, user_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES user(id))',

    creatUserItemBridgingTable: 'CREATE TABLE IF NOT EXISTS user_item (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, item_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (user_id) REFERENCES user(id), FOREIGN KEY (item_id) REFERENCES item(id), CONSTRAINT uq_user_item_combo UNIQUE(user_id, item_id))',

    creatListItemBridgingTable: 'CREATE TABLE IF NOT EXISTS list_item (id INT NOT NULL AUTO_INCREMENT, list_id INT NOT NULL, item_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (list_id) REFERENCES list(id), FOREIGN KEY (item_id) REFERENCES item(id), CONSTRAINT uq_list_item_combo UNIQUE(list_id, item_id))',

    creatRecipeItemBridgingTable: 'CREATE TABLE IF NOT EXISTS recipe_item (id INT NOT NULL AUTO_INCREMENT, recipe_id INT NOT NULL, item_id INT NOT NULL, PRIMARY KEY (id), FOREIGN KEY (recipe_id) REFERENCES recipe(id), FOREIGN KEY (item_id) REFERENCES item(id), CONSTRAINT uq_recipe_item_combo UNIQUE(recipe_id, item_id))',
    
};