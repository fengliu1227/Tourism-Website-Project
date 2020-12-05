const express = require('express');
const router = express.Router();
const attractions = require("./attractions");
const usersRoutes = require('./users')
const commentsRoute = require('./comments');
const travelogueRoute = require('./travelogue');

const constructorMethod = (app) =>{
    app.get('/',(req,res)=>{
        res.render('partials/index');
    });
    app.use('/users', usersRoutes);
    app.use('/attractions',attractions);
    app.use('/comments', commentsRoute);
    app.use('/travelogues', travelogueRoute);
    app.use('/',router);
    app.use('*',(req,res)=>{
        res.status(404).json({error: 'Not found'});
    })
}
module.exports = constructorMethod;
