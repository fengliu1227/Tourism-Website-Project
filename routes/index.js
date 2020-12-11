const express = require('express');
const router = express.Router();
const attractions = require("./attractions");
const usersRoutes = require('./users')
const commentsRoute = require('./comments');
const travelogueRoute = require('./travelogue');
const apiRoutes = require('./api');

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        if (req.session.user) {
            res.render('partials/index', { loggedIn: true });
        } else {
            res.render('partials/index', { loggedIn: false });
        }
    });
    app.use('/api', apiRoutes);
    app.use('/users', usersRoutes);
    app.use('/attractions', attractions);
    app.use('/comments', commentsRoute);
    app.use('/travelogues', travelogueRoute);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    })
}
module.exports = constructorMethod;