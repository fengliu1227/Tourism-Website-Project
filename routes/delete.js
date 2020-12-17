const express = require("express");
const router = express.Router();
const data = require('../data/');
const users = data.users
const attractions = data.attractions;
const comments = data.comments;
const travelogues = data.travelogues;
const adminDeleteInfo = data.adminDeleteInfo;

router.get('/attractions/:id', async(req, res) => {
    if (!req.admin) {
        throw 'You are not administrator';
    }
    try {
        const attraction = await attractions.getAttraction(req.params.id);
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

        // for(let i=0; i<traveloguesList.length; i++) {
        //     try {
        //         await travelogues.removeTravelogue(traveloguesList[i]._id);
        //     }catch(e) {
        //         res.status(400).json({error: e})
        //         return;
        //     }
        // }
        for (let i = 0; i < commentsList.length; i++) {
            try {
                await comments.removeComment(commentsList[i]._id);
            } catch (e) {
                res.status(400).json({ error: e })
                return;
            }
        }
        try {
            await attractions.deleteAttraction(req.params.id)
            await users.removeAttractionFromUserByAdmin(attraction.userId, req.params.id);
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
    if (!req.admin) {
        throw 'You are not administrator';
    }
    try {
        const thisTravelogue = await travelogues.getTraveloguesById(req.params.id)
        const currentTime = new Date().toString();
        let deleteInfo = {
            Time: currentTime,
            Type: 'travelogue',
            Information: thisTravelogue.travelogue.title
        };
        console.log(deleteInfo);
        await adminDeleteInfo.updateDeleteInfo('admin@outlook.com', deleteInfo);

        try {
            await travelogues.removeTravelogue(req.params.id)
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
    if (!req.admin) {
        throw 'You are not administrator';
    }
    try {
        const thisComment = await comments.getCommentsById(req.params.id)
        const currentTime = new Date().toString();
        let deleteInfo = {
            Time: currentTime,
            Type: 'comment',
            Information: thisComment.comment
        };
        console.log(deleteInfo);
        await adminDeleteInfo.updateDeleteInfo('admin@outlook.com', deleteInfo);

        try {
            await comments.removeComment(req.params.id)
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
    try{
        await users.deleteUser(req.params.id);
        req.session.destroy();
        res.redirect('/');
    }catch(e){
        res.status(500).json({error: e})
        return
    }
})

router.get('/userAttractions/:id', async(req, res) => {
    try {
        const attraction = await attractions.getAttraction(req.params.id);
        let commentsList = [];
        let index2 = 0;
        for (let x of attraction.relatedCommentsId) {
            commentsList[index2++] = await comments.getCommentsById(x.id);
        }

        // for(let i=0; i<traveloguesList.length; i++) {
        //     try {
        //         await travelogues.removeTravelogue(traveloguesList[i]._id);
        //     }catch(e) {
        //         res.status(400).json({error: e})
        //         return;
        //     }
        // }
        for (let i = 0; i < commentsList.length; i++) {
            try {
                await comments.removeComment(commentsList[i]._id);
            } catch (e) {
                res.status(400).json({ error: e })
                return;
            }
        }
        try {
            await attractions.deleteAttraction(req.params.id)
            await users.removeAttractionFromUserByAdmin(attraction.userId, req.params.id);
            res.redirect('/users/private')
        } catch (e) {
            res.status(500).json({ error: e })
        }
    } catch (e) {
        res.status(404).json({ error: 'Attraction not found' });
        return;
    }
})

module.exports = router;