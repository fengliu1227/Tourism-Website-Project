const express = require('express');
const router = express.Router();
const data = require('../data');
const usersData = data.users;
const attractions = data.attractions;
const travelogues = data.travelogues;
const comments = data.comments;
const adminDeleteInfo = data.adminDeleteInfo;
const bcrypt = require('bcrypt');
const { updateUser } = require('../data/users');
const saltRounds = 16;

router.get('/', async(req, res) => {
    if (req.session.user) {
        return res.redirect('/users/private')
    } else {
        return res.redirect('/users/login')
    }
});

// router.get('/', async (req, res) => {
//     return res.redirect('/users/login')
// });

router.get('/login', async(req, res) => {
    if (req.session.user) {
        return res.redirect('/users/private')
    } else {
        res.render('users/login')
        return
    }
    // res.render('users/login')
})

router.post('/login', async(req, res) => {
    let users = await usersData.getAllUsers();
    let useremail = req.body.useremail;
    let password = req.body.password;
    // console.log(useremail);
    // console.log(password);
    try {
        for (let i = 0; i < users.length; i++) {
            // console.log(users[i]);
            // console.log(users[i].password);
            useremail = useremail.toLowerCase();
            // console.log(useremail);
            let match = await bcrypt.compare(password, users[i].password);
            // console.log(match);
            if (match && useremail == users[i].email) {
                if(useremail == "admin@outlook.com") {
                    req.session.user = {
                        email: users[i].email,
                        // firstName: users[i].userName.firstName,
                        // lastName: users[i].userName.lastName,
                        userId: users[i]._id,
                        isAdmin: {
                            type: Boolean,
                            default: true
                        }
                    }
                }else{
                    req.session.user = {
                        email: users[i].email,
                        // firstName: users[i].userName.firstName,
                        // lastName: users[i].userName.lastName,
                        userId: users[i]._id,
                        isAdmin: {
                            type: Boolean,
                            default: false
                        }
                    }
                }
                    //modified
                if (req.body.pageFrom && req.body.pageFrom == "profile") {
                    res.redirect('/users/private');
                }
                if (req.body.pageFrom && req.body.pageFrom == "add" && req.body.attractionToAddId) {
                    res.redirect('/attractions/found/' + req.body.attractionToAddId);
                }
                return res.render('partials/index', { loggedIn: true });
            }
        }
        return res.status(401).render('users/login', {
            error: 'Please provide a valid email or password',
            hasErrors: true
        });
    } catch (e) {
        return res.status(401).render('users/login', {
            error: 'Please provide a valid email or password',
            hasErrors: true
        });
    }
});

router.get('/private', async(req, res) => {
    let curUser = await usersData.getUserById(req.session.user.userId);
    let spots = [];
    for (let j = 0; j < curUser.spotsId.length; j++) {
        let spot = await attractions.getAttraction(curUser.spotsId[j]);
        spots.push(spot);
    }
    let travelogueList = [];
    for (let x of curUser.travelogueId) {
        let travelogue = await travelogues.getTraveloguesById(x.id);
        travelogueList.push(travelogue);
    }
    let commentsList = [];
    for (let x of curUser.commentId) {
        let comment = await comments.getCommentsById(x.id);
        commentsList.push(comment);
    }
    return res.render('users/profile', { user: curUser, spots: spots, Comments: commentsList, Travelogues: travelogueList, loggedIn: true })
})

router.post('/signup', async(req, res) => {
    let { useremail, password, firstName, lastName, gender } = req.body;

    if (!useremail) {
        res.status(401).render('users/login', {
            error: 'You need to provide user email',
            hasErrors: true
        });
        // res.status(400).json({error: 'You need to provide user email'});
        return;
    }

    if (!password) {
        res.status(401).render('users/login', {
            error: 'You need to provide a password',
            hasErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!firstName) {
        res.status(401).render('users/login', {
            error: 'You need to provide a firstName',
            hasErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!lastName) {
        res.status(401).render('users/login', {
            error: 'You need to provide a lastName',
            hasErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!gender) {
        res.status(401).render('users/login', {
            error: 'You need to provide a gender',
            hasErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    useremail = useremail.toLowerCase();
    // console.log(useremail);
    let userName = { firstName: firstName, lastName: lastName };
    try {
        const newUser = await usersData.createUser(
            useremail,
            password,
            userName,
            gender
        );
        if(useremail == "admin@outlook.com") {
            req.session.user = {
                email: useremail,
                // firstName: userName.firstName,
                // lastName: userName.lastName,
                userId: newUser._id,
                isAdmin: {
                    type: Boolean,
                    default: true
                }
            }
            const createAdmin = await adminDeleteInfo.createAdmin(useremail);
        }else{
            req.session.user = {
            email: useremail,
            // firstName: userName.firstName,
            // lastName: userName.lastName,
            userId: newUser._id,
            isAdmin: {
                type: Boolean,
                default: false
            }
        }}
        
        return res.render('partials/index', { loggedIn: true });
    } catch (e) {
        res.status(401).render('users/login', {
            error: e,
            hasErrors: true
        });
        // res.status(500).json({error: e});
    }
})

router.patch('/private', async(req, res) => {
    const { userFirstName, userLastName, gender } = req.body;
    let userName = {};
    let updatedObj = { userName };
    try {
        const oldUser = await usersData.getUserById(req.session.user.userId);
        // console.log(oldUser);
        console.log(userFirstName.trim().length)
        if (userFirstName.trim().length && userFirstName !== oldUser.userName.firstName) {
            updatedObj.userName.firstName = userFirstName;
        } else {
            updatedObj.userName.firstName = oldUser.userName.firstName;
        }

        if (userLastName.trim().length && userLastName !== oldUser.userName.lastName) {
            updatedObj.userName.lastName = userLastName;
        } else {
            updatedObj.userName.lastName = oldUser.userName.lastName;
        }

        if (gender && gender !== oldUser.gender)
            updatedObj.gender = gender;
    } catch (e) {
        console.log(e);
        res.status(404).json({ error: e });
        return;
    }

    if (Object.keys(updatedObj).length !== 0 && Object.keys(userName).length !== 0) {
        try {
            const updateUser = await usersData.updateUser(
                req.session.user.userId,
                updatedObj
            );
            return res.redirect('/users/private');
        } catch (e) {
            res.status(401).render('users/profile', {
                user: await usersData.getUserById(req.session.user.userId),
                error: 'You need to provide infomation',
                hasErrors: true
            });
        }
    } else {
        res.status(401).render('users/profile', {
            user: await usersData.getUserById(req.session.user.userId),
            error: 'You need to provide infomation',
            hasErrors: true,
            loggedIn: true
        });
    }
})

router.get('/logout', async(req, res) => {
    req.session.destroy();
    res.render('users/logout', {});
})

module.exports = router;