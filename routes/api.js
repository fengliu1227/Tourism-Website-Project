const express = require('express');
const router = express.Router();
const data = require('../data');
const comments = data.comments;
const users = data.users;
const attractions = data.attractions;



router.get('/comments/:id', async(req, res) => {
    if (!req.params.id) { throw 'No commentId provided (stage2)'; }
    try {
        const currentAttraction = await attractions.getAttraction(req.params.id);
        let commentsList = [];
        let i = 0;
        for (let x of currentAttraction.relatedCommentsId) {
            commentsList[i++] = await comments.getCommentsById(x.id);
        }
        let commentWithUserName = [];
        let index = 0;
        for (let x of commentsList) {
            let user = await users.getUserById(x.userId);
            commentWithUserName[index++] = { user: user.userName.firstName + " " + user.userName.lastName, rating: x.rating, comment: x.comment };
        }
        res.json(commentWithUserName);
    } catch (e) {
        res.status(404).render('error/error', { error: e });
        return;
    }
});

router.post('/addComment', async(req, res) => {

    if (req.session.user) {
        if (!req.session.user.userId) { throw 'No userId supplied when add a comment (stage2)'; }
        if (!req.body.attractionId) { throw 'No attractionId provided when add a comment (stage2)'; }
        if (!req.body.rating) { throw 'No rating provided when add a comment (stage2)'; }
        if (!req.body.comment) { throw 'No comment provided when add a comment (stage2)'; }
        try {
            let user = await users.getUserById(req.session.user.userId);
            for (let x in user.commentedAttraction) {
                if (user.commentedAttraction[x].id == req.body.attractionId) {
                    res.json({ error: "already" });
                    return;
                }
            }
            let newComment = await comments.addComments(req.session.user.userId, req.body.attractionId, req.body.rating, req.body.comment);
            await users.addAttractionIdToUserWhenAddComment(newComment.userId, req.body.attractionId);
            let attraction = await attractions.getAttraction(req.body.attractionId);
            let name = user.userName.firstName + " " + user.userName.lastName;
            let comment = newComment;
            res.json({ user: name, rating: comment.rating, newRating: attraction.description.Rating, comment: comment.comment });
            return;
        } catch (e) {
            res.status(404).render('error/error', { error: e });
            return;
        }
    } else {
        res.json({ error: "notLogIn" });
        return;
    }
});

module.exports = router;