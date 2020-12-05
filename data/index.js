const usersData = require('./users');
const attractions = require('./attractions');
// const reviewData = require('./reviews');
// const commentData = require('./comments');
const comments = require('./comments');
const travelogues = require('./travelogues');
module.exports = { 
    users: usersData,
    attractions: attractions,
    // reviews: reviewData,
    // comments: commentData
    comments: comments,
    travelogues: travelogues
};