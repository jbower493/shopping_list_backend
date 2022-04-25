// import dependencies
const express = require('express');

// import controllers
const listController = require('../controllers/listController.js');

// import access control methods
const access = require('../access_control');

// create list router
const listRouter = express.Router();


// POST /api/list
// ACCESS: logged in USER
listRouter.post('/', access.loggedInUser, listController.create);


// export auth router for use in server.js
module.exports = listRouter;