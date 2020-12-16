const usersData = require('./users');
const attractions = require('./attractions');
// const reviewData = require('./reviews');
// const commentData = require('./comments');
const comments = require('./comments');
const travelogues = require('./travelogues');
const users = require('./users');
const adminDeleteInfo = require('./adminDeleteInfo');
const e = require('express');
module.exports = {
    users: usersData,
    attractions: attractions,
    // reviews: reviewData,
    // comments: commentData
    comments: comments,
    travelogues: travelogues,
    adminDeleteInfo: adminDeleteInfo
};

const main = async() => {
        await comments.updateComment("5fd9c22d3a9948f723c76c23", "3", "changed");
    }
    // main();
    /* user data format:
        userName: {firstName: 'N/A', lastName: 'N/A'},
        email: email,
        gender: 'N/A',
        password: hashedPassword,
        privilege: 0,
        commentId: [],
        spotsId: [],
        travelogueId: [] 

    attaction data format:
        userId : userId,
        relatedCommentsId : relatedCommentsId,
        relatedTravelogueId : relatedCommentsId,
        description :{Name,Category,Rating,Img,Price,Content,Address}

    travelogue data format:
        userId: userId,
        relatedAttractoinId: relatedAttractoinId,
        travelogue: {title, content}

    comment data format:
            userId: userId.toString(),
            relatedAttractionId: relatedAttractionId.toString(),
            like: 0,
            unlike: 0,
            rating: rating,
            comment: comment
        };
    */