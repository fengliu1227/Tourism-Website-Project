const express = require("express");
const router = express.Router();
const data = require('../data/');
const attractions = data.attractions;
const comments = data.comments;
const travelogues = data.travelogues;
const xss = require('xss');

//router added(FL)
router.get('/found/:id', async(req, res) => {

    if (!xss(req.params.id)) { throw 'You must provide an id (stage2)!!!'; }

    try {
        const attraction = await attractions.getAttraction(xss(req.params.id));
        let commentsList = [];
        let index2 = 0;
        for (let x of attraction.relatedCommentsId) {
            commentsList[index2++] = await comments.getCommentsById(x.id);
        }
        res.render('partials/attractionDetail', {
            Attractions: attraction,
            Comments: commentsList,
            isAdmin: req.admin,
            loggedIn: req.session.user
        });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post('/Search', async(req, res) => {

    try {
        let attractionList = await attractions.getAttractionBySearch(xss(req.body.searchTerm));
        let loggedIn = false;
        let sortedAttractionList = [];
        for (x of attractionList) {
            sortedAttractionList.push(x);
        }
        sortedAttractionList.sort(function(a, b) { return b.description.Rating - a.description.Rating });


        if (req.session.user) loggedIn = true;
        res.render('partials/SearchResult', { attractionSearch: true, sortBtn: true, searchTerm: xss(req.body.searchTerm), attractions: attractionList, sortedAttractions: sortedAttractionList, loggedIn: loggedIn });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});
router.post("/add", async(req, res) => {
    // if(!user.session.user){
    //     res.render('/');
    //     return;
    // }
    if (!xss(req.session.user.userId)) { throw 'No userId provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionName)) { throw 'No attractionName provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionCategory)) { throw 'No Category provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionRating)) { throw 'No rating provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionImg)) { throw 'No img provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionPrice)) { throw 'No price provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionContent)) { throw 'No Content provided when add an attraction (stage2)'; }
    if (!xss(req.body.attractionAddress)) { throw 'No Address provided when add an attraction (stage2)'; }
    try {
        userId = xss(req.session.user.userId);
        description = {
            Name: xss(req.body.attractionName),
            Category: xss(req.body.attractionCategory),
            Rating: xss(req.body.attractionRating),
            Img: xss(req.body.attractionImg),
            Price: xss(req.body.attractionPrice),
            Content: xss(req.body.attractionContent),
            Address: xss(req.body.attractionAddress)
        }
        const attraction = await attractions.addAttractions(userId, description);

        res.render('partials/attractionDetail', { Attractions: attraction, isAdmin: xss(req.admin), loggedIn: true });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
})

module.exports = router;