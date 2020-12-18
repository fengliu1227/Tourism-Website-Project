const { ObjectId } = require('mongodb');
const users = require('./users');
const mongoCollections = require("../config/mongoCollections");
const attractions = mongoCollections.attractions;

async function addAttractions(userId, description) {
    if (!userId) { throw 'no userId provided when add an attraction' }
    if (!description) { throw 'no description provided when add an attraction' }
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
async function getAllAttraction(){
    const attractionCollection = await attractions();
    let attractionList = await attractionCollection.find({}).toArray();

    for (i in attractionList) {
        attractionList[i]._id = attractionList[i]._id.toString();
    }
 
    return attractionList;
}
async function getAttraction(id) {
    if (!id) throw "id must be given when you want to get a certaian attraction";
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
    if (!attractionId) { throw 'You need to provide id of this attraction when add a comment to attraction' };
    if (!commentId) { throw 'You need to provide id of this comment when add a comment to attraction' };
    if (!rating) { throw 'You need to provide rating in your comment when add a comment to attraction' };
    const attractionCollection = await attractions();
    const targetAttraction = await attractionCollection.findOne({ _id: ObjectId(attractionId) });
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

//remove Comment from Atrraction data, added by feng liu
async function removeCommentFromAttraction(attractionId, commentId) {
    if (!attractionId) { throw 'You need to provide id of this attraction when remove a comment from attraction' };
    if (!commentId) { throw 'You need to provide id of this comment when remove a comment from attraction' };
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
    if (!id) throw 'Please provide an id to delete a certain attraction';
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
    if (!oldRating) { 'For caculating new rating, you need to provide old rating' };
    if (!newRating) { 'For caculating new rating, you need to provide new rating in the new comment' };
    if (!number) { 'For caculating new rating, you need to provide the numbers of total rating' };
    if (number == 0) {
        let result = (oldRating + newRating) / (number + 1);
        return result;
    } else {
        let result = (oldRating * number + newRating) / (number + 1);
        return result;
    }
}

async function updateCommentToAttraction(attractionId, difference) {
    if (attractionId != null && difference != null) {
        const attractionCollection = await attractions();
        const targetAttraction = await attractionCollection.findOne({ _id: ObjectId(attractionId) });
        let newRating = (Number(targetAttraction.description.Rating) * Number(targetAttraction.numOfComments) + Number(difference)) / Number(targetAttraction.numOfComments);
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
        let updateInfo = await attractionCollection.updateOne({ _id: ObjectId(attractionId) }, { $set: { description: newDescription } });
        if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
            throw 'Error: re-write the attraction rating failed';
            return;
        }
        return await this.getAttraction(attractionId);
    } else {
        throw 'Lack some important information to re-write the attraction rating!!!';
    }
}

module.exports = {
    addAttractions,
    getAttraction,
    getAttractionBySearch,
    addCommentToAttraction,
    removeCommentFromAttraction,
    deleteAttraction,
    updateCommentToAttraction,
    getAllAttraction
}