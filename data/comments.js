const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;

async function addComments(userId, attricationId, description) {
    const commentsCollection = await comments();
    let newComment = {
        userId: userId,
        attricationId: attricationId,
        description: description
    };
    const insertInfo = await commentsCollection.insertOne(newComment);
    if (insertInfo.insertedCount === 0) throw "could not add Comment";
    const newId = insertInfo.insertedId + "";
    const Comment = await getCommentById(newId);
    return Comment;
}

async function getCommentById(id) {
    const commentsCollection = await comments();
    const comment = await commentsCollection.findOne({ _id: ObjectId(id) });

    if (!comment) throw "comment with that id does not exist";
    return comment;
}

async function getCommentByAttractionId(attractionId) {
    const commentsCollection = await comments();
    const comment = await commentsCollection.findOne({ attractionId: ObjectId(attractionId) });

    if (!comment) throw "comment with that id does not exist";
    return comment;
}

async function getCommentByUserId(userId) {
    const commentsCollection = await comments();
    const comment = await commentsCollection.findOne({ userId: ObjectId(userId) });

    if (!comment) throw "comment with that id does not exist";
    return comment;
}

async function deleteCommentById(id) {
    if (!id) {
        throw "provide an id for deleting comment";
    }
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';
    const commentsCollection = await comments();

    const deletionInfo = await commentsCollection.removeOne({ _id: ObjectId(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete comment with this id of ${id}`;
    }
    return true;
}

async function updateComment(id, updateComment) {
    if (!id) throw 'Please provide an id';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';

    const commentsCollection = await comments();
    const updateCommentData = {};
    let parsedId = ObjectId(id);
    const oldComment = await this.getCommentById(id);

    updateCommentData.userId = oldComment.userId;
    updateCommentData.attricationId = oldComment.attricationId;

    if (updateComment.description) {
        updateCommentData.description = updateComment.description;
    }

    await commentsCollection.updateOne({ _id: parsedId }, { $set: updateCommentData });
    return await this.getCommentById(id);
}

module.exports = {
    addComments,
    getCommentById,
    getCommentByUserId,
    getCommentByAttractionId,
    deleteCommentById,
    updateComment
}
