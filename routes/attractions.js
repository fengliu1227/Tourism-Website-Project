const express = require("express");
const router = express.Router();
const data = require('../data/');
const attractions = data.attractions;
const comments = data.comments;
const travelogues = data.travelogues;

//router added(FL)
router.get('/found/:id', async(req, res) => {

    if (!req.params.id) {
        throw 'You must provide an id!!!';
    }
    try {
        // console.log(typeof(req.params.id) + "  in the router " + req.params.id);
        const attraction = await attractions.getAttraction(req.params.id);
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
        let attractionList = await attractions.getAttractionBySearch(req.body.searchTerm);
        let loggedIn = false;
        let sortedAttractionList = [];
        for (x of attractionList) {
            sortedAttractionList.push(x);
        }
        sortedAttractionList.sort(function(a, b) { return b.description.Rating - a.description.Rating });


        if (req.session.user) loggedIn = true;
        res.render('partials/SearchResult', { attractionSearch: true, sortBtn: true, searchTerm: req.body.searchTerm, attractions: attractionList, sortedAttractions: sortedAttractionList, loggedIn: loggedIn });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});
router.post("/add", async(req, res) => {
    // if(!user.session.user){
    //     res.render('/');
    //     return;
    // }
    try {
        userId = req.session.user.userId;
        description = {
            Name: req.body.attractionName,
            Category: req.body.attractionCategory,
            Rating: req.body.attractionRating,
            Img: req.body.attractionImg,
            Price: req.body.attractionPrice,
            Content: req.body.attractionContent,
            Address: req.body.attractionAddress
        }
        const attraction = await attractions.addAttractions(userId, description);

        res.render('partials/attractionDetail', { Attractions: attraction, isAdmin: req.admin, loggedIn: true });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
})

module.exports = router;