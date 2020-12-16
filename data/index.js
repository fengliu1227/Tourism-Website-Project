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
main = async function() {
        await comments.addComments("5fd9b1b9e0f189eef1726b78", "5fd9b60fc981c9f0e5fc928c", "0", "test")
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
*/