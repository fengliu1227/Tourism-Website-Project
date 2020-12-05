const express = require("express");
const router = express.Router();
const data = require('../data/');
const attractions = data.attractions;

router.post('/Search', async (req,res)=>{
    let attractionList = await attractions.getAttractionBySearch(req.body.searchTerm);
    console.log(attractionList.length);
    let loggedIn = false;
    if(req.session.user) loggedIn = true;
    res.render('partials/SearchResult',{searchTerm : req.body.searchTerm, attractions:attractionList,loggedIn : loggedIn});
});
router.post("/add", async(req,res)=>{
    // if(!user.session.user){
    //     res.render('/');
    //     return;
    // }
    console.log(req.session.user);
    userId = req.session.user.userId;
    relatedCommentsId = [];
    relatedTravelogueId = [];
    description = {
        Name:req.body.attractionName,
        Category:req.body.attractionCategory,
        Rating:req.body.attractionRating,
        Img:req.body.attractionImg,
        Price:req.body.attractionPrice,
        Content:req.body.attractionContent,
        Address:req.body.attractionAddress
    }
    const attraction =  await attractions.addAttractions(userId,relatedCommentsId,relatedTravelogueId,description);

    
    res.json(attraction);
})

module.exports = router;

