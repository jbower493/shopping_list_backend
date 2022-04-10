// import dependencies
const express = require('express');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const cors = require('cors');

// import authController
const authController = require('./controllers/authController');

// import routers
const authRouter = require('./routes/auth.js');

// import db
const db = require('./config/db/db');

// define app and port
const app = express();
const PORT = process.env.PORT;

// connect to DB
db.connect(err => {
    if (err) {
        return console.error(err.stack);
    }
    console.info(`${process.env.NODE_ENV} database connected`);
});

// allow cross origin resource sharing
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// parse json request bodies
app.use(express.json());

// add a 1 second delay to responses if dev mode, so I can see the loading states in development
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'dev') {
        return setTimeout(() => next(), 1000);
    }
    next();
});

// check for logged in use and add to req object if there is one
app.use(authController.deserializeUser);

// mount routers
app.use('/api/auth', authRouter);

// 404 response
app.use((req, res, next) => {
    res.status(404).json({ error: 'No route exists' });
});

// error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error, apologies' });
});

// run the app
app.listen(PORT, () => console.info('App started'));