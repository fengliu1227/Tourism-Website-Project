const express = require('express');
const router = express.Router();
const data = require('../data');
const comments = data.comments;

router.get('/private', async (req, res) => {
    if (req.session.user) {
        let userId = req.session.user.userId;
        let result = await comments.getCommentByUserId(userId);
        if(result){
            res.render('comments/private', {result, noEmpty: true});
        }else{
            res.render('comments/private', {empty: true});
        }
    }else {
        res.redirect('/users/login')
    }
});

router.post('/private/comments', async (req, res) => {
    if (req.session.user) {
        let user = req.session.user;
        let userId = user.userId;
        let attricationId = req.attricationId;
        let description = req.description;

        let result = await comments.addComments(userId, attricationId, description);
        if(result){
            res.render('comments/addComment', {success: true});
        }else{
            res.render('comments/addComment', {error: true});
        }
    }else {
        res.redirect('/users/login')
    }
});