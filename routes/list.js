// import dependencies
const express = require('express');

// import controllers
const listController = require('../controllers/listController.js');

// import access control methods
const access = require('../access_control');

// create list router
const listRouter = express.Router();


// GET /api/list
// ACCESS: logged in USER
listRouter.get('/', access.loggedInUser, listController.allLists);

// POST /api/list
// ACCESS: logged in USER
listRouter.post('/', access.loggedInUser, listController.create);

// GET /api/list/:id
// ACCESS: logged in USER
listRouter.get('/:id', access.loggedInUser, listController.info);

// PUT /api/list/:id
// ACCESS: logged in USER
listRouter.put('/:id', access.loggedInUser, listController.edit);

// DELETE /api/list/:id
// ACCESS: logged in USER
listRouter.delete('/:id', access.loggedInUser, listController.delete);


// export auth router for use in server.js
module.exports = listRouter;