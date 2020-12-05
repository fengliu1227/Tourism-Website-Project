const express = require("express");
const router = express.Router();
const data = require('../data/');
const travelogues = data.travelogues;

router.get('/', async(req, res) => {
    res.render('travelogues/search');
});

router.get('/search', async(req, res) => {
    res.render('travelogues/search');
});

router.post('/result', async(req, res) => {
    console.log(req.body);
    let traveloguesList = await travelogues.getTraveloguesBySearch(req.body.searchTerm);
    res.render('travelogues/result', { Research: true, Detail: false, keyword: "result of " + req.body.searchTerm, travelogue: traveloguesList });

    //for test without data
    // var a = [{ title: "?????", content: "!!!!!" }];
    // res.render('travelogues/result', { Research: true, Detail: false, keyword: "lalallalala", Travelogue: a });
});

router.post('/detail', async(req, res) => {
    let currentTravelogue = { title: req.body.travelogueTitle, content: req.body.travelogueContent }
    res.render('travelogues/result', { Research: false, Detail: true, Travelogue: currentTravelogue });
});

router.get("/add", async(req, res) => {
    if (req.session.user) {
        res.render('travelogues/add');
    } else {
        res.redirect('/users/login')
    }
    // for test without data
    // res.render('travelogues/add');
});


router.get("/mine", async(req, res) => {
    if (req.session.user) {
        let travelogueList = await travelogues.getTraveloguesByUserId(req.session.user.userId);
        res.render('travelogues/myTravelogues'), { travelogue: travelogueList };
    } else {
        res.redirect('/users/login')
    }
})


module.exports = router;