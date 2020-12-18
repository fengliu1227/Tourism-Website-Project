const { json } = require("express");
const express = require("express");
const router = express.Router();
const data = require('../data');
const travelogues = data.travelogues;
const xss = require('xss');

router.post('/Search', async(req, res) => {
    try {
        let travelogueList = await travelogues.getTraveloguesBySearch(xss(req.body.searchTerm));
        let loggedIn = false;
        if (xss(req.session.user)) loggedIn = true;
        res.render('partials/SearchResult', { travelogueSearch: true, searchTerm: xss(req.body.searchTerm), travelogues: travelogueList, loggedIn: loggedIn });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
})
router.get('/found/:id', async(req, res) => {
    if (!req.params.id) { throw 'No travelogueId provided when get a travelogue (stage2)'; }
    if (!req.params.id) {
        throw 'You must provide an id!!!';
    }
    let loggedIn = false;
    if (req.session.user) loggedIn = true;
    try {
        const travelogue = await travelogues.getTraveloguesById(xss(req.params.id));
        // console.log(travelogue.travelogue.content);
        res.render('travelogues/travelogueDetail', {
            Travelogue: travelogue,
            isAdmin: req.admin,
            loggedIn: loggedIn
        });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post('/result', async(req, res) => {
    try {
        let traveloguesList = await travelogues.getTraveloguesBySearch(xss(req.body.searchTerm));
        res.render('travelogues/result', { Research: true, Detail: false, keyword: "result of " + xss(req.body.searchTerm), travelogue: traveloguesList });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.get("/add", async(req, res) => {
    try {
        if (req.session.user) {
            res.render('travelogues/add', { loggedIn: true });
        } else {
            res.redirect('/users/login')
        }
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post("/add", async(req, res) => {
    if (!xss(req.body.travelogueTitle)) { throw 'No travelogue title provided when add a travelogue (stage2)'; }
    if (!xss(req.body.travelogueContent)) { throw 'No travelogue content provided when add a travelogue (stage2)'; }
    if (!xss(req.session.user.userId)) { throw 'No userId provided when add a travelogue (stage2)'; }
    try {
        let currentTravelogue = { title: xss(req.body.travelogueTitle), content: xss(req.body.travelogueContent) }
        let travelogue = await travelogues.addTravelogues(xss(req.session.user.userId), currentTravelogue);
        travelogue._id = travelogue._id + "";
        res.json({ success: true, Travelogue: travelogue });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});


// router.get("/mine", async(req, res) => {
//     try{
//         if (req.session.user) {
//             let travelogueList = await travelogues.getTraveloguesByUserId(req.session.user.userId);
//             res.render('travelogues/myTravelogues'), { travelogue: travelogueList };
//         } else {
//             res.redirect('/users/login')
//         }
//     }catch(e){
//         res.status(404).render('error/error', { error: e });
//     }
// })


module.exports = router;