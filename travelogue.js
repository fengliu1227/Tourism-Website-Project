const express = require('express');
const router = express.Router();
const data = require('../data');
const travelogues = data.travelogues;

router.get('/private', async (req, res) => {
    if (req.session.user) {
        let userId = req.session.user.userId;
        let result = await travelogues.getTravelogueByUserId(userId);
        if(result){
            res.render('travelogues/private', {result, noEmpty: true});
        }else{
            res.render('travelogues/private', {empty: true});
        }
    }else {
        res.redirect('/users/login')
    }
});

router.post('/private/travelogues', async (req, res) => {
    if (req.session.user) {
        let user = req.session.user;
        let userId = user.userId;
        let attricationId = req.attricationId;
        let description = req.description;

        let result = await travelogues.addTravelogue(userId, attricationId, description);
        if(result){
            res.render('travelogues/addTravelogue', {success: true});
        }else{
            res.render('travelogues/addTravelogue', {error: true});
        }
    }else {
        res.redirect('/users/login')
    }
});