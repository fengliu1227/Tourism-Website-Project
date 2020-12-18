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
    try {
        if (req.session.user) {
            return res.redirect('/users/private')
        } else {
            return res.redirect('/users/login')
        }
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
});


router.get('/login', async(req, res) => {
    try {
        if (req.session.user) {
            return res.redirect('/users/private')
        } else {
            res.render('users/login')
            return
        }
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
    // res.render('users/login')
})

router.post('/login', async(req, res) => {
    // if (req.body.useremail && req.body.password) {
    //     const useremail = req.body.useremail;
    //     const password = req.body.password;
    // }
    // let users = await usersData.getAllUsers();
    if (!req.body.useremail) { throw 'No user email provided when login (stage2)'; }
    if (!req.body.password) { throw 'No travelogueId provided when login (stage2)'; }
    try {
        let user = await usersData.getUserByEmail(req.body.useremail);
        let useremail = req.body.useremail;
        let password = req.body.password;
        let match = false;
        if (user.email == useremail) {
            match = await bcrypt.compare(password, user.password);
        }
        if (match) {
            if (useremail == "admin@outlook.com") {
                req.session.user = {
                    email: user.email,
                    // firstName: users[i].userName.firstName,
                    // lastName: users[i].userName.lastName,
                    userId: user._id,
                    isAdmin: {
                        type: Boolean,
                        default: true
                    }
                }
            } else {
                req.session.user = {
                    email: user.email,
                    // firstName: users[i].userName.firstName,
                    // lastName: users[i].userName.lastName,
                    userId: user._id,
                    isAdmin: {
                        type: Boolean,
                        default: false
                    }
                }
            }
            //modified
            if (req.body.pageFrom && req.body.pageFrom == "profile") {
                res.redirect('/users/private');
                return;
            }
            if (req.body.pageFrom && req.body.pageFrom == "add" && req.body.attractionToAddId) {
                res.redirect('/attractions/found/' + req.body.attractionToAddId);
                return;
            }
            return res.render('partials/index', { loggedIn: true });
        }
    } catch (e) {
        return res.status(401).render('users/login', {
            error: 'Please provide a valid email or password',
            hasLogInErrors: true
        });
    }
});


router.get('/private', async(req, res) => {
    if (!req.session.user.userId) { throw 'No user id provided when visiting profile page(stage2)'; }
    try {
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

        let deleteInfoList = []
        if (req.admin) {

            let deleteInfo = await adminDeleteInfo.getAdminByEmail("admin@outlook.com")

            deleteInfoList = deleteInfo.deleteInfo
        }

        // return res.render('users/profile', { user: curUser, spots: spots, Comments: commentsList, Travelogues: travelogueList, DeleteInfo: deleteInfoList, loggedIn: true, isAdmin: req.admin });
        return res.render('users/profile', { user: curUser, spots: spots, Comments: commentsList, Travelogues: travelogueList, DeleteInfo: deleteInfoList, loggedIn: true });
    } catch (e) {
        res.status(404).render('error/error', { error: e });
    }
})

router.post('/signup', async(req, res) => {
    if (!req.body) { throw 'No input provided when sign up (stage2)'; }
    let { useremail, password, firstName, lastName, gender } = req.body;
    if (!useremail) {
        res.status(401).render('users/login', {
            error: 'You need to provide user email',
            hasSignUpErrors: true
        });
        // res.status(400).json({error: 'You need to provide user email'});
        return;
    }

    if (!password) {
        res.status(401).render('users/login', {
            error: 'You need to provide a password',
            hasSignUpErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!firstName) {
        res.status(401).render('users/login', {
            error: 'You need to provide a firstName',
            hasSignUpErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!lastName) {
        res.status(401).render('users/login', {
            error: 'You need to provide a lastName',
            hasSignUpErrors: true
        });
        // res.status(400).json({error: 'You need to provide a password'});
        return;
    }
    if (!gender) {
        res.status(401).render('users/login', {
            error: 'You need to provide a gender',
            hasSignUpErrors: true
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
        if (useremail == "admin@outlook.com") {
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
        } else {
            req.session.user = {
                email: useremail,
                // firstName: userName.firstName,
                // lastName: userName.lastName,
                userId: newUser._id,
                isAdmin: {
                    type: Boolean,
                    default: false
                }
            }
        }

        return res.render('partials/index', { loggedIn: true });
    } catch (e) {
        res.status(401).render('users/login', {
            error: e,
            hasSignUpErrors: true
        });
        // res.status(500).json({error: e});
    }
})

router.patch('/private', async(req, res) => {
    if (!req.body) { throw 'No input provided when patch your profile (stage2)'; }
    if (!req.session.user.userId) { throw 'No input provided when patch your profile (stage2)'; }
    const { userFirstName, userLastName, gender, password } = req.body;
    let userName = {};
    let updatedObj = { userName };
    try {
        const oldUser = await usersData.getUserById(req.session.user.userId);
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

        if (password) {
            updatedObj.password = password;
        }

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