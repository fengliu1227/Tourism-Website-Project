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
main = async() => {
    const user = await users.createUser("email@email.com", "1", "test", "male");
    const attraction = await attractions.addAttractions(user._id, { Name: "name", Category: "category", Rating: "test", Img: "test", Price: "test", Content: "test", Address: "test" });
    const travelogue1 = await travelogues.addTravelogues(user._id, attraction._id, { title: "test tilte3", content: "test content3" });
    const comment1 = await comments.addComments(user._id, attraction._id, "it is great--test3");
    const travelogue2 = await travelogues.addTravelogues(user._id, attraction._id, { title: "test tilte4", content: "test content4" });
    const comment2 = await comments.addComments(user._id, attraction._id, "it is great--test4");



};
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