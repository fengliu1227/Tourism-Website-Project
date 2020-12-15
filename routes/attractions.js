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
        const attraction = await attractions.getAttraction(req.params.id);
        let traveloguesList = [];
        let index = 0;
        for (let x of attraction.relatedTravelogueId) {
            traveloguesList[index++] = await travelogues.getTraveloguesById(x.id);
        }
        let commentsList = [];
        let index2 = 0;
        for (let x of attraction.relatedCommentsId) {
            commentsList[index2++] = await comments.getCommentsById(x.id);
        }

        res.render('partials/attractionDetail', {
            Attractions: attraction,
            Travelogues: traveloguesList,
            Comments: commentsList,
            isAdmin: req.admin
        });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post('/found/:id', async(req, res) => {
    if (!req.params.id) {
        throw 'You must provide an id!!!';
    }
    console.log(res.body);
    // console.log(req.session.user);
    // try {
    //     const comment = await comments.addComments(req.params.id);
    //     let traveloguesList = [];
    //     let index = 0;
    //     for (let x of attraction.relatedTravelogueId) {
    //         traveloguesList[index++] = await travelogues.getTraveloguesById(x.id);
    //     }
    //     res.render('partials/attractionDetail', {
    //         Attractions: attraction,
    //         Travelogues: traveloguesList
    //     });
    // } catch (e) {
    //     res.status(404).render('error/error', { error: e });
    // }
});

router.post('/Search', async(req, res) => {
    let attractionList = await attractions.getAttractionBySearch(req.body.searchTerm);
    let loggedIn = false;
    if (req.session.user) loggedIn = true;
    res.render('partials/SearchResult', { searchTerm: req.body.searchTerm, attractions: attractionList, loggedIn: loggedIn });
});
router.post("/add", async(req, res) => {
    // if(!user.session.user){
    //     res.render('/');
    //     return;
    // }
    console.log(req.body);
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

    res.render('partials/attractionDetail', { searchTerm: req.body.searchTerm, Attractions: attraction, loggedIn: true });

})

module.exports = router;