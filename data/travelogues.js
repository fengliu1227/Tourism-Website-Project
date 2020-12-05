const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const travelogues = mongoCollections.travleogues;

async function addTravelogue(userId, attricationId, description) {
    const traveloguesCollection = await travelogues();
    let newTravelogue = {
        userId: userId,
        attricationId: attricationId,
        description: description,
    };
    const insertInfo = await traveloguesCollection.insertOne(newTravelogue);
    if (insertInfo.insertedCount === 0) throw "could not add Travelogue";
    const newId = insertInfo.insertedId + "";
    const Travelogue = await getTravelogueById(newId);
    return Travelogue;
}

async function updateTravelogue(id, travelogue) {
    if (!id) throw 'Please provide an id';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';

    const traveloguesCollection = await travelogues();
    const updateTravelogueData = {};
    let parsedId = ObjectId(id);
    const oldTravelogue = await this.getTravelogueById(id);

    updateTravelogueData.userId = oldTravelogue.userId;
    updateTravelogueData.attricationId = oldTravelogue.attricationId;

    if (travelogue.description) {
        updateTravelogueData.description = travelogue.description;
    }

    await traveloguesCollection.updateOne({ _id: parsedId }, { $set: updateTravelogueData });
    return await this.getTravelogueById(id);
}

async function getTravelogueById(id) {
    const traveloguesCollection = await travelogues();
    const travelogue = await traveloguesCollection.findOne({ _id: ObjectId(id) });

    if (!travelogue) throw "comment with that id does not exist";
    return travelogue;
}

async function getTravelogueByUserId(userId) {
    const traveloguesCollection = await travelogues();
    const travelogue = await traveloguesCollection.findOne({ userId: ObjectId(userId) });

    if (!travelogue) throw "comment with that id does not exist";
    return travelogue;
}

async function deleteTravelogueById(id) {
    if (!id) {
        throw "provide an id for deleting travelogue";
    }
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';
    const traveloguesCollection = await travleogues();

    const deletionInfo = await traveloguesCollection.removeOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete travelogue with this id of ${id}`;
    }
    return true;
}

module.exports = {
    addTravelogue,
    updateTravelogue,
    getTravelogueById,
    getTravelogueByUserId,
    deleteTravelogueById
}