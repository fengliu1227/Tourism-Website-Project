const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = require('../data/users');
const attractions = require('../data/attractions');

let exportedMothod = {
    async addComments(userId, relatedAttractionId, rating, comment) {
        if (!userId && !relatedAttractionId && !comment) throw 'all fields need to input a value';
        const commentsCollection = await comments();
        let newComments = {
            userId: userId.toString(),
            relatedAttractionId: relatedAttractionId.toString(),
            like: 0,
            unlike: 0,
            rating: rating,
            comment: comment
        };
        const insertInfo = await commentsCollection.insertOne(newComments);
        if (insertInfo.insertedCount === 0) throw "add comments failed";
        const newId = insertInfo.insertedId;

        try {
            await attractions.addCommentToAttraction(relatedAttractionId, newId.toString(), rating);
            await users.addCommentToUser(userId, newId.toString());
        } catch (e) {
            throw "add comment failed";
        }
        const currentComment = await this.getCommentsById(newId.toString());
        return currentComment;
    },
    async getCommentsById(id) {
        if (!id) throw "no id provided";
        const commentsCollection = await comments();
        const comment = await commentsCollection.findOne({ _id: ObjectId(id) });
        if (!comment) throw "comment with that id does not exist";
        return comment;
    },

    async getCommentsByUserId(userId) {
        if (!userId) throw 'No useId provided';
        const commentsCollection = await comments();
        const comment = await commentsCollection.findOne({ userId: userId });
        if (!comment) throw "Opps! Not Found the comment of that user";
        return comment;
    },

    async getCommentsByAttractionId(attractionId) {
        const commentsCollection = await comments();
        const comment = await commentsCollection.find({ relatedAttractionId: attractionId });

        if (!comment) throw "comment with that id does not exist";
        return comment;
    },


    async removeComment(id) {
        if (!id) throw 'no id provided';
        const commentsCollection = await comments();
        let comment = null;
        try {
            comment = await this.getCommentsById(id);
        } catch (e) {
            console.log(e);
        }

        // try {
        const deletionInfo = await commentsCollection.removeOne({ _id: ObjectId(id) });
        if (deletionInfo.deletedCount === 0) throw 'Error: delete failed';
        await attractions.removeCommentFromAttraction(comment.relatedAttractionId, id);
        await users.removeCommentFromUser(comment.userId, id);
        // } catch (e) {
        //     throw "remove comment failed";
        // }
        return { "CommentId": id, "deleted": true };
    }
}

module.exports = exportedMothod;