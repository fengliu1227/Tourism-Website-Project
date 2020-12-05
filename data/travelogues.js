const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const travelogues = mongoCollections.travelogues;
const users = require('../data/users');
const attractions = require('../data/attractions');

let exportedMothod = {
    async addTravelogues(userId, relatedAttractoinId, travelogue) {
        if (!userId && !relatedAttractoinId && !travelogue) throw 'all fields need to input a value';
        const traveloguesCollection = await travelogues();
        let newTravelogues = {
            userId: userId,
            relatedAttractoinId: relatedAttractoinId,
            travelogue: travelogue
        };
        const insertInfo = await traveloguesCollection.insertOne(newTravelogues);
        if (insertInfo.insertedCount === 0) throw "add travelogues failed";
        const newId = insertInfo.insertedId;
        try {
            await attractions.addTravelogueToAttraction(relatedAttractoinId, newId.toString());
            await users.addTravelogueToUser(userId, newId.toString());
        } catch (e) {
            throw "add travelogues failed";
        }
        const currentTravelogue = await this.getTraveloguesById(newId.toString());
        return currentTravelogue;
    },
    async getTraveloguesById(id) {
        if (!id) throw "no id provided";
        const traveloguesCollection = await travelogues();
        const travelogue = await traveloguesCollection.findOne({ _id: ObjectId(id) });
        if (!travelogue) throw "travelogue with that id does not exist";
        return travelogue;
    },

    async getTraveloguesByUserId(userId) {
        if (!userId) throw 'No useId provided';
        const traveloguesCollection = await travelogues();
        const travelogue = await traveloguesCollection.findOne({ userId: ObjectId(userId) });
        if (!travelogue) throw "Opps! Not Found the travelogues of that user";
        return travelogue;
    },

    async getTraveloguesByAttractionId(attractionId) {
        const traveloguesCollection = await travelogues();
        const travelogue = await traveloguesCollection.findOne({ relatedAttractoinId: ObjectId(attractionId) });

        if (!travelogue) throw "comment with that id does not exist";
        return travelogue;
    },

    async getTraveloguesBySearch(searchTerm) {
        if (!searchTerm) throw 'No keyword provided!?';
        const query = new RegExp(searchTerm, 'i');
        const traveloguesCollection = await travelogues();
        const traveloguesList = await traveloguesCollection.find({ "travelogue.Name": query }).toArray();
        return traveloguesList;
    },

    async removeTravelogue(id) {
        if (!id) throw 'no id provided';
        const traveloguesCollection = await travelogues();
        let travelogue = null;
        try {
            travelogue = await await this.getTraveloguesById(id);
        } catch (e) {
            console.log(e);
        }
        try {
            const deletionInfo = await traveloguesCollection.removeOne({ _id: ObjectId(id) });
            if (deletionInfo.deletedCount === 0) throw 'Error: delete failed';
            await attractions.removeTravelogueFromAttraction(travelogue.relatedAttractoinId, id);
            await users.removeTravelogueFromUser(travelogue.userId, id);
        } catch (e) {
            throw "remove travelogues failed";
        }
        return { "travelogueId": id, "deleted": true };
    }
}

module.exports = exportedMothod;