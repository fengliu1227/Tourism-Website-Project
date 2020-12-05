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
    description : description

travelogue data format:
    userId: userId,
    relatedAttractoinId: relatedAttractoinId,
    travelogue: {title, content}
*/