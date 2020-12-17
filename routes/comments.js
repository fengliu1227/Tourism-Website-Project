const express = require('express');
const router = express.Router();
const data = require('../data');
const comments = data.comments;


router.get('/update/:id', async(req, res) => {
    if (req.session.user) {
        res.render('comments/updateComment');
    } else {
        res.redirect('/users/login');
    }
});

router.post('/update/:id', async(req, res) => {
    if (req.session.user) {
        if (req.body.changeWhich == "ratingOnly") {
            try {
                const oldComment = await comments.getCommentsById(req.params.id);
                await comments.updateComment(req.params.id, req.body.updatedRating, oldComment.comment);
                res.render('comments/updateComment', {
                    sucuess: true
                });
            } catch (e) {
                res.status(404).render('error/error', { error: e });
            }
        }
        if (req.body.changeWhich == "commentOnly") {
            try {
                const oldComment = await comments.getCommentsById(req.params.id);
                const comment = await comments.updateComment(req.params.id, oldComment.rating, req.body.updatedComment);
                res.render('comments/updateComment', {
                    sucuess: true
                });
            } catch (e) {
                res.status(404).render('error/error', { error: e });
            }
        } else {
            try {
                const comment = await comments.updateComment(req.params.id, req.body.updatedRating, req.body.updatedComment);
                res.render('comments/updateComment', {
                    sucuess: true
                });
            } catch (e) {
                res.status(404).render('error/error', { error: e });
            }
        }
    } else {
        res.redirect('/users/login');
    }
})

module.exports = router;