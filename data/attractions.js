const { ObjectId } = require('mongodb');
const users = require('./users');
const mongoCollections = require("../config/mongoCollections");
const attractions = mongoCollections.attractions;

async function addAttractions(userId, description) {
    const attractionCollection = await attractions();
    let newAttractions = {
        userId: userId,
        relatedCommentsId: [],
        numOfComments: 1,
        description: description
    };
    const insertInfo = await attractionCollection.insertOne(newAttractions);
    if (insertInfo.insertedCount === 0) throw "could not add attraction";
    const newId = insertInfo.insertedId + "";
    const attraction = await getAttraction(newId);
    await users.updateUser(userId, { spotsId: newId });
    return attraction;
}

async function getAttraction(id) {
    if (!id) throw "id must be given";
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


//add Comment To Attraction data, added by feng liu
async function addCommentToAttraction(attractionId, commentId, rating) {
    const attractionCollection = await attractions();
    const targetAttraction = await attractionCollection.findOne({ _id: ObjectId(attractionId) });
    console.log(Number(targetAttraction.description.Rating));
    console.log(targetAttraction.numOfComments);
    let newRating = await caculateRating(Number(targetAttraction.description.Rating), Number(rating), targetAttraction.numOfComments);
    newRating = Math.floor(newRating * 100) / 100;
    let newDescription = {
        Name: targetAttraction.description.Name,
        Category: targetAttraction.description.Category,
        Rating: newRating.toString(),
        Img: targetAttraction.description.Img,
        Price: targetAttraction.description.Price,
        Content: targetAttraction.description.Content,
        Address: targetAttraction.description.Address
    }
    let updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: { numOfComments: targetAttraction.numOfComments + 1, description: newDescription } });
    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $addToSet: { relatedCommentsId: { id: commentId.toString() } } });
    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getAttraction(attractionId);
}

//remove Travelogue from Atrraction data, added by feng liu
async function removeCommentFromAttraction(attractionId, commentId) {
    let currentAttaction = await this.getAttraction(attractionId);
    const newComment = {};
    newComment.relatedCommentsId = [];
    let index = 0;
    for (let i of currentAttaction.relatedCommentsId) {
        if (i.id.toString() == commentId) continue;
        newComment.relatedCommentsId[index++] = i;
    }
    const attractionCollection = await attractions();
    const updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: newComment });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    await this.getAttraction(attractionId);
}

async function deleteAttraction(id) {
    if (!id) throw 'Please provide an id';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';

    const attractionCollection = await attractions();

    let parsedId = ObjectId(id);

    const deletionInfo = await attractionCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete attraction with this id of ${id}`;
    }
    console.log('Delete succeed')

    return true;
}

async function caculateRating(oldRating, newRating, number) {
    if (number == 0) {
        let result = (oldRating + newRating) / (number + 1);
        console.log("newRating = " + result);
        return result;
    } else {
        let result = (oldRating * number + newRating) / (number + 1);
        console.log("newRating = " + result);
        return result;
    }
}

module.exports = {
    addAttractions,
    getAttraction,
    getAttractionBySearch,
    addCommentToAttraction,
    removeCommentFromAttraction,
    deleteAttraction
}