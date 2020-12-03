const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const attractions = mongoCollections.attractions;

async function addAttractions(userId,relatedCommentsId,relatedTravelogueId,description){
    const attractionCollection = await attractions();
    let newAttractions = {
        userId : userId,
        relatedCommentsId : relatedCommentsId,
        relatedTravelogueId : relatedCommentsId,
        description : description
    };
    const insertInfo = await attractionCollection.insertOne(newAttractions);
    if(insertInfo.insertedCount === 0) throw "could not add attraction";
    const newId = insertInfo.insertedId + "";
    const attraction = await getAttraction(newId);
    return attraction;
}
async function getAttraction(id) {
    // if (!id) throw "id must be given";
    // if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
    const attractionCollection = await attractions();
    const attraction = await attractionCollection.findOne({ _id: ObjectId(id)});
    if (!attraction) throw "attraction with that id does not exist";
    return attraction;
}

async function getAttractionBySearch (searchTerm){
    const query = new RegExp(searchTerm,'i');
    const attractionCollection = await attractions();
    const attractionList = await attractionCollection.find({"description.Name":query}).toArray();
    return attractionList;
}

module.exports = {
    addAttractions,
    getAttraction,
    getAttractionBySearch
}