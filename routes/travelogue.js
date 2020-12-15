const { json } = require("express");
const express = require("express");
const router = express.Router();
const data = require('../data');
const travelogues = data.travelogues;

router.get('/', async(req, res) => {
    res.render('travelogues/search');
});

router.get('/search', async(req, res) => {
    res.render('travelogues/search');
});

router.get('/found/:id', async(req, res) => {
    if (!req.params.id) {
        throw 'You must provide an id!!!';
    }
    let loggedIn = false;
    if(req.session.user) loggedIn = true;
    try {
        const travelogue = await travelogues.getTraveloguesById(req.params.id);
        // console.log(travelogue.travelogue.content);
        res.render('travelogues/result', {
            Research: false,
            Detail: true,
            Travelogue: travelogue,
            loggedIn:loggedIn
        });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post('/result', async(req, res) => {
    console.log(req.body);
    let traveloguesList = await travelogues.getTraveloguesBySearch(req.body.searchTerm);
    res.render('travelogues/result', { Research: true, Detail: false, keyword: "result of " + req.body.searchTerm, travelogue: traveloguesList });
});


router.get("/add", async(req, res) => {
    if (req.session.user) {
        res.render('travelogues/add',{loggedIn:true});
    } else {
        res.redirect('/users/login')
    }
});

router.post("/add", async(req, res) => {
    let currentTravelogue = { title: req.body.travelogueTitle, content: req.body.travelogueContent }
    console.log(currentTravelogue);
    await travelogues.addTravelogues(req.session.user.userId, currentTravelogue);
    // res.render('travelogues/add', { success: true, Travelogue: currentTravelogue });
    res.json(currentTravelogue);
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