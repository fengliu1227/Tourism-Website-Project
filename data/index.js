const usersData = require('./users');
const attractions = require('./attractions');
const comments = require('./comments');
const travelogues = require('./travelogues');
const users = require('./users');
const adminDeleteInfo = require('./adminDeleteInfo');
const e = require('express');
module.exports = {
    users: usersData,
    attractions: attractions,
    comments: comments,
    travelogues: travelogues,
    adminDeleteInfo: adminDeleteInfo
};

/* user data format:
    userName: {firstName: 'N/A', lastName: 'N/A'},
    email: email,
    gender: 'N/A',
    password: hashedPassword,
    privilege: 0,
    commentId: [],
    spotsId: [],
    travelogueId: [] ,
    commentedAttraction: []

attaction data format:
    userId: userId,
    relatedCommentsId: [],
    numOfComments: 1,
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