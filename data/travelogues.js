const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const travelogues = mongoCollections.travelogues;
const users = require('../data/users');

let exportedMothod = {
    async addTravelogues(userId, travelogue) {
        if (!userId || !travelogue) throw 'all fields need to input a value to add a travelogue';
        const traveloguesCollection = await travelogues();
        let newTravelogues = {
            userId: userId.toString(),
            travelogue: travelogue
        };
        const insertInfo = await traveloguesCollection.insertOne(newTravelogues);
        if (insertInfo.insertedCount === 0) throw "add travelogues failed";
        const newId = insertInfo.insertedId;
        try {
            await users.addTravelogueToUser(userId, newId.toString());
        } catch (e) {
            throw "add travelogues failed";
        }
        const currentTravelogue = await this.getTraveloguesById(newId.toString());
        return currentTravelogue;
    },
    async getTraveloguesById(id) {
        if (!id) throw "no id provided when get a tavelogue by id";
        const traveloguesCollection = await travelogues();
        const travelogue = await traveloguesCollection.findOne({ _id: ObjectId(id) });
        if (!travelogue) throw "travelogue with that id does not exist";
        return travelogue;
    },

    async getTraveloguesByUserId(userId) {
        if (!userId) throw 'No useId provided when get a travelogue by userId';
        const traveloguesCollection = await travelogues();
        const travelogue = await traveloguesCollection.findOne({ userId: userId });
        if (!travelogue) throw "Opps! Not Found the travelogues of that user";
        return travelogue;
    },


    async getTraveloguesBySearch(searchTerm) {
        const query = new RegExp(searchTerm, 'i');
        const traveloguesCollection = await travelogues();
        const traveloguesList = await traveloguesCollection.find({ "travelogue.title": query }).toArray();
        return traveloguesList;
    },

    async removeTravelogue(id) {
        if (!id) throw 'no id provided when remove a travelogue';
        const traveloguesCollection = await travelogues();
        let travelogue = null;
        try {
            travelogue = await this.getTraveloguesById(id);
        } catch (e) {
            console.log(e);
        }

        try {
            const deletionInfo = await traveloguesCollection.removeOne({ _id: ObjectId(id) });
            if (deletionInfo.deletedCount === 0) throw 'Error: delete failed';
            await users.removeTravelogueFromUser(travelogue.userId, id);
        } catch (e) {
            throw "remove travelogues failed";
        }
        return { "travelogueId": id, "deleted": true };
    }
}

module.exports = exportedMothod;