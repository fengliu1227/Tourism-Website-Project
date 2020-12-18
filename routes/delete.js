const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users
const attractions = data.attractions;
const comments = data.comments;
const travelogues = data.travelogues;
const adminDeleteInfo = data.adminDeleteInfo;
const xss = require('xss');

router.get('/attractions/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No attractionId provided when delete an attraction (stage2)'; }
    if (!xss(req.admin)) {
        throw 'You are not administrator';
    }
    try {
        const attraction = await attractions.getAttraction(xss(req.params.id));
        let commentsList = [];
        let index2 = 0;
        for (let x of attraction.relatedCommentsId) {
            commentsList[index2++] = await comments.getCommentsById(x.id);
        }

        const currentTime = new Date().toString();
        let deleteInfo = {
            Time: currentTime,
            Type: 'attraction',
            Information: attraction.description.Name
        };
        console.log(deleteInfo);
        await adminDeleteInfo.updateDeleteInfo('admin@outlook.com', deleteInfo);

        for (let i = 0; i < commentsList.length; i++) {
            try {
                await comments.removeComment(commentsList[i]._id);
            } catch (e) {
                res.status(400).json({ error: e })
                return;
            }
        }
        try {
            await attractions.deleteAttraction(xss(req.params.id))
            await users.removeAttractionFromUserByAdmin(attraction.userId, xss(req.params.id));
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: 'Attraction not found' });
        return;
    }
})

router.get('/travelogues/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No travelogueId provided when delete a travelogue (stage2)'; }
    if (!xss(req.admin)) {
        throw 'You are not administrator';
    }
    try {
        const thisTravelogue = await travelogues.getTraveloguesById(xss(req.params.id))
        const currentTime = new Date().toString();
        let deleteInfo = {
            Time: currentTime,
            Type: 'travelogue',
            Information: thisTravelogue.travelogue.title
        };
        console.log(deleteInfo);
        await adminDeleteInfo.updateDeleteInfo('admin@outlook.com', deleteInfo);

        try {
            await travelogues.removeTravelogue(xss(req.params.id))
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: e });
        return;
    }
})

router.get('/comments/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No commentId provided when delete a comment (stage2)'; }
    if (!xss(req.admin)) {
        throw 'You are not administrator';
    }
    try {
        const thisComment = await comments.getCommentsById(xss(req.params.id))
        const currentTime = new Date().toString();
        let deleteInfo = {
            Time: currentTime,
            Type: 'comment',
            Information: thisComment.comment
        };
        console.log(deleteInfo);
        await adminDeleteInfo.updateDeleteInfo('admin@outlook.com', deleteInfo);

        try {
            await comments.removeComment(xss(req.params.id))
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: e });
        return;
    }
})

router.get('/users/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No userId provided when delete an user (stage2)'; }
    try {
        const userInfo = await users.getUserById(xss(req.params.id));

        for (let x of userInfo.spotsId) {
            // console.log(x);
            const attraction = await attractions.getAttraction(x);
            // console.log(attraction)
            let commentsList = [];
            let index2 = 0;
            for (let y of attraction.relatedCommentsId) {
                console.log(y)
                commentsList[index2++] = await comments.getCommentsById(y.id);
                console.log(commentsList);
            }
            for (let i = 0; i < commentsList.length; i++) {
                try {
                    await comments.removeComment(commentsList[i]._id);
                } catch (e) {
                    res.status(400).json({ error: e })
                    return;
                }
            }
            await attractions.deleteAttraction(x);
        }
        let travelouguesList = [];
        let index3 = 0;
        for (let i of userInfo.travelogueId) {
            console.log(i);
            travelouguesList[index3++] = await travelogues.getTraveloguesById(i.id);
            console.log(travelouguesList);
        }
        for (let i = 0; i < travelouguesList.length; i++) {
            try {
                await travelogues.removeTravelogue(travelouguesList[i]._id);
            } catch (e) {
                res.status(400).json({ error: e })
                return;
            }
        }
        await users.deleteUser(xss(req.params.id));

        req.session.destroy();
        res.redirect('/');
    } catch (e) {
        res.status(500).json({ error: e })
        return
    }
})

router.get('/userAttractions/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No AttractionId provided when delete an attraction from user (stage2)'; }
    try {
        const attraction = await attractions.getAttraction(xss(req.params.id));
        let commentsList = [];
        let index2 = 0;
        for (let x of attraction.relatedCommentsId) {
            commentsList[index2++] = await comments.getCommentsById(x.id);
        }

        for (let i = 0; i < commentsList.length; i++) {
            try {
                await comments.removeComment(commentsList[i]._id);
            } catch (e) {
                res.status(400).json({ error: e })
                return;
            }
        }
        try {
            await attractions.deleteAttraction(xss(req.params.id))
            await users.removeAttractionFromUserByAdmin(attraction.userId, xss(req.params.id));
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: 'Attraction not found' });
        return;
    }
})

router.get('/userTravelogues/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No AttractionId provided when delete an attraction from user (stage2)'; }
    try {
        const travelogue = await travelogues.getTraveloguesById(xss(req.params.id));

        try {
            await travelogues.removeTravelogue(xss(req.params.id));
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: 'travelogue you want to delete not found' });
        return;
    }
})

router.get('/userComments/:id', async(req, res) => {
    if (!xss(req.params.id)) { throw 'No AttractionId provided when delete an attraction from user (stage2)'; }
    try {
        const comment = await comments.getCommentsById(xss(req.params.id));

        try {
            await comments.removeComment(xss(req.params.id));
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: 'travelogue you want to delete not found' });
        return;
    }
})
module.exports = router;