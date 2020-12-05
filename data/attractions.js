const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const attractions = mongoCollections.attractions;

async function addAttractions(userId, relatedCommentsId, relatedTravelogueId, description) {
    const attractionCollection = await attractions();
    let newAttractions = {
        userId: userId,
        relatedCommentsId: relatedCommentsId,
        relatedTravelogueId: relatedCommentsId,
        description: description
    };
    const insertInfo = await attractionCollection.insertOne(newAttractions);
    if (insertInfo.insertedCount === 0) throw "could not add attraction";
    const newId = insertInfo.insertedId + "";
    const attraction = await getAttraction(newId);
    return attraction;
}
async function getAttraction(id) {
    // if (!id) throw "id must be given";
    // if (typeof(id) === "string") id = ObjectId.createFromHexString(id);
    const attractionCollection = await attractions();
    const attraction = await attractionCollection.findOne({ _id: ObjectId(id) });
    if (!attraction) throw "attraction with that id does not exist";
    return attraction;
}

async function getAttractionBySearch(searchTerm) {
    const query = new RegExp(searchTerm, 'i');
    const attractionCollection = await attractions();
    const attractionList = await attractionCollection.find({ "description.Name": query }).toArray();
    return attractionList;
}

//add Attraction To User data, added by feng liu
async function addTravelogueToAttraction(attractionId, travelogueId) {
    let currentAttaction = await this.getAttraction(newId);

    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $addToSet: { relatedTravelogueId: { id: travelogueId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getAttraction(newId);
}

//remove Attraction from User data, added by feng liu
async function removeTravelogueFromAttraction(attractionId, travelogueId) {
    let currentAttaction = await this.getAttraction(newId);
    const newTravelogue = {};
    newTravelogue.travelogue = [];
    let index = 0;
    for (let i of currentAttaction.relatedTravelogueId) {
        if (i.id.toString() == travelogueId) continue;
        newReview.reviews[index++] = i;
    }
    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: newTravelogue });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    await this.getAttraction(newId);
}

module.exports = {
    addAttractions,
    getAttraction,
    getAttractionBySearch,
    addTravelogueToAttraction,
    removeTravelogueFromAttraction
}