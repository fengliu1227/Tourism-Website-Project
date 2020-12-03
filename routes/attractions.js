const express = require("express");
const router = express.Router();
const data = require('../data/');
const attractions = data.attractions;

router.post('/Search', async (req,res)=>{
    let attractionList = await attractions.getAttractionBySearch(req.body.searchTerm);
    console.log(attractionList.length);
    res.render('partials/SearchResult',{searchTerm : req.body.searchTerm, attractions:attractionList});
});
router.post("/add", async(req,res)=>{
    const attraction =  await attractions.addAttractions(req.body.userId,req.body.relatedCommentsId,req.body.relatedTravelogueId,req.body.description);
    res.json(attraction);
})


module.exports = router;

