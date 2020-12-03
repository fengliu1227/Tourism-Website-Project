const express = require('express');
const router = express.Router();
const attractions = require("./attractions");
const usersRoutes = require('./users')

const constructorMethod = (app) =>{
    app.get('/',(req,res)=>{
        res.render('partials/index');
    });
    app.use('/users', usersRoutes);
    app.use('/attractions',attractions);
    app.use('/',router);
    app.use('*',(req,res)=>{
        res.status(404).json({error: 'Not found'});
    })
}
module.exports = constructorMethod;