const express = require('express');
const router = express.Router();
const data = require('../data');
const comments = data.comments;
const xss = require('xss');


router.get('/update/:id', async(req, res) => {
    try {
        if (xss(req.session.user)) {
            res.render('comments/updateComment', { loggedIn: true });
        } else {
            res.redirect('/users/login');
        }
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});

router.post('/update/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No commentId provided when update a comment (stage2)'; }
    if (!xss(req.body.updatedRating) && !xss(req.body.updatedComment)) { throw 'you need provieded rating or comment of all of them when update a comment (stage2)'; }
    if (xss(req.session.user)) {
        if (xss(req.body.changeWhich) == "ratingOnly") {
            try {
                const oldComment = await comments.getCommentsById(xss(req.params.id));
                await comments.updateComment(xss(req.params.id), xss(req.body.updatedRating), oldComment.comment);
                res.render('comments/updateComment', {
                    sucuess: true,
                    loggedIn: true
                });
                return;
            } catch (e) {
                res.status(404).render('error/error', { error: e });
                return;
            }
        }
        if (xss(req.body.changeWhich) == "commentOnly") {
            try {
                const oldComment = await comments.getCommentsById(xss(req.params.id));
                const comment = await comments.updateComment(xss(req.params.id), oldComment.rating, xss(req.body.updatedComment));
                res.render('comments/updateComment', {
                    sucuess: true,
                    loggedIn: true
                });
                return;
            } catch (e) {
                res.status(404).render('error/error', { error: e });
                return;
            }
        } else {
            try {
                const comment = await comments.updateComment(xss(req.params.id), xss(req.body.updatedRating), xss(req.body.updatedComment));
                res.render('comments/updateComment', {
                    sucuess: true,
                    loggedIn: true
                });
                return;
            } catch (e) {
                res.status(404).render('error/error', { error: e });
                return;
            }
        }
    } else {
        res.redirect('/users/login');
        return;
    }
})

module.exports = router;