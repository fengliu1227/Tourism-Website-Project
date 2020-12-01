const express = require('express');
const router = express.Router();
const path = require('path');

const constructorMethod = (app) =>{
    app.use('/',(req,res)=>{
        res.render('partials/index');
    });
    app.use('*',(req,res)=>{
        res.status(404).json({error: 'Not found'});
    })
}
module.exports = constructorMethod;