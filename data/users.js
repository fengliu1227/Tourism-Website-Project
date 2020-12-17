const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
// const { reviews } = require('../config/mongoCollections');
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

async function getAllUsers() {
    const usersCollection = await users();
    let usersList = await usersCollection.find({}).toArray();

    for (i in usersList) {
        usersList[i]._id = usersList[i]._id.toString();
    }

    return usersList;
}

async function getUserById(id) {
    if (!id) throw 'You must provide an id when get a user';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid when get a user';

    const usersCollection = await users();

    let parsedId = ObjectId(id);
    // console.log('Parsed it correctly, now I can pass parsedId into my query.');

    const getUser = await usersCollection.findOne({ _id: parsedId });
    if (getUser === null) throw 'No user with that id when get a user';
    getUser._id = getUser._id.toString();

    return getUser;
}
async function getUserByEmail(email) {
    if (!email) throw "no email!";
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    if (!reg.test(email)) throw 'Email is not valid';
    const usersCollection = await users();
    const getUser = await usersCollection.findOne({ email: email });
    getUser._id = getUser._id + "";
    return getUser;
}

async function createUser(email, password, userName, gender) {
    if (!email || !password || !userName || !gender) throw 'Please provide all fields when create a user'
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    if (!reg.test(email)) throw 'Email is not valid';
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    email = email.toLowerCase();

    const usersCollection = await users();
    let existEmail = true;
    try{
        await getUserByEmail(email);
    }catch(e){
        existEmail = false;
    }
    if(existEmail) throw 'This email has been registered';

    let newUser = {
        // _id: uuid(),
        userName: userName,
        email: email,
        gender: gender,
        password: hashedPassword,
        privilege: 0,
        commentId: [],
        spotsId: [],
        travelogueId: [],
        commentedAttraction: []
    };
    const newInsertInformation = await usersCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    const newId = newInsertInformation.insertedId.toString();

    const user = await this.getUserById(newId);
    user._id = user._id.toString();
    return user;
}

async function updateUser(id, updateUser) {
    if (!id) throw 'Please provide an id';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';
    if (!updateUser) { throw 'no update user data provided when updating a user' };

    const usersCollection = await users();
    const updatedUserData = {};
    let parsedId = ObjectId(id);
    const oldUser = await this.getUserById(id);

    if (updateUser.userName) {
        updatedUserData.userName = updateUser.userName;
    }
    // if(updateUser.userName.lastName) {
    //     updatedUserData.userName.lastName = updateUser.userName.lastName;
    // }
    if (updateUser.gender) {
        updatedUserData.gender = updateUser.gender;
    }
    if (updateUser.password) {
        const hashedPassword = await bcrypt.hash(updateUser.password, saltRounds);
        updatedUserData.password = hashedPassword;
    }
    if (updateUser.privilege) {
        updatedUserData.privilege = updateUser.privilege;
    }
    if (updateUser.commentId) {
        updatedUserData.commentId = oldUser.commentId.concat(updateUser.commentId);
    }
    if (updateUser.spotsId) {
        updatedUserData.spotsId = oldUser.spotsId.concat(updateUser.spotsId);
    }
    if (updateUser.travelogueId) {
        updatedUserData.travelogueId = oldUser.travelogueId.concat(updateUser.travelogueId);
    }

    console.log(updatedUserData);
    await usersCollection.updateOne({ _id: parsedId }, { $set: updatedUserData });

    return await this.getUserById(id);
}

async function deleteUser(id) {
    if (!id) throw 'Please provide an id when delete a user';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';

    const usersCollection = await users();

    let parsedId = ObjectId(id);

    const deletionInfo = await usersCollection.removeOne({ _id: parsedId });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with this id of ${id}`;
    }
    console.log('Delete succeed')

    return true;
}

//add Travelogue To User data, added by feng liu
async function addTravelogueToUser(userId, travelogueId) {
    if (!userId) { throw 'no userId provided when add a travelogue to user data' };
    if (!travelogueId) { throw 'no travelogueId provided when add a travelogue to user data' };
    let currentUser = await this.getUserById(userId);

    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $addToSet: { travelogueId: { id: travelogueId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getUserById(userId);
}

//remove Travelogue from User data, added by feng liu
async function removeTravelogueFromUser(userId, travelogueId) {
    if (!userId) { throw 'no userId provided when remove a travelogue from user data' };
    if (!travelogueId) { throw 'no travelogueId provided when remove a travelogue from user data' };
    let currentUser = await this.getUserById(userId);
    const newTravelogue = {};
    newTravelogue.travelogueId = [];
    let index = 0;
    for (let i of currentUser.travelogueId) {
        if (i.id.toString() == travelogueId) continue;
        newTravelogue.travelogueId[index++] = i;
    }
    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: newTravelogue });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    return await this.getUserById(userId);
}


//add Comment To User data, added by feng liu
async function addCommentToUser(userId, commentId) {
    if (!userId) { throw 'no userId provided when add a comment to user data' };
    if (!commentId) { throw 'no commentId provided when add a comment to user data' };
    let currentUser = await this.getUserById(userId);

    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $addToSet: { commentId: { id: commentId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getUserById(userId);
}

//remove Comment from User data, added by feng liu
async function removeCommentFromUser(userId, commentId) {
    if (!userId) { throw 'no userId provided when remove a comment from user data' };
    if (!commentId) { throw 'no commentId provided when remove a comment from user data' };
    let currentUser = await this.getUserById(userId);
    const newComment = {};
    newComment.commentId = [];
    let index = 0;
    for (let i of currentUser.commentId) {
        if (i.id.toString() == commentId) continue;
        newComment.commentId[index++] = i;
    }
    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: newComment });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    return await this.getUserById(userId);
}

async function removeAttractionFromUserByAdmin(userId, attractionId) {
    if (!userId) { throw 'no userId provided when remove a attaction by admin' };
    if (!attractionId) { throw 'no attractionId provided when remove a attaction by admin' };
    let currentUser = await this.getUserById(userId);
    const newAttraction = {};
    newAttraction.spotsId = [];
    let index = 0;
    for (let i of currentUser.spotsId) {
        if (i.toString() == attractionId) continue;
        newAttraction.spotsId[index++] = i;
    }
    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: newAttraction });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    return await this.getUserById(userId);
}

//add Attraction Id when a user add a comment
async function addAttractionIdToUserWhenAddComment(userId, AttractionId) {
    if (!userId) { throw 'no userId provided when add attractionId to user when add a comment' };
    if (!AttractionId) { throw 'no attractionId when add attractionId to user when add a comment' };
    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $addToSet: { commentedAttraction: { id: AttractionId.toString() } } });

    if (!updateInfo.matchedCount && !updatedInfo.modifiedCount) {
        // throw 'Error: update failed';
        return;
    }
    return await this.getUserById(userId);
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    addTravelogueToUser,
    removeTravelogueFromUser,
    addCommentToUser,
    removeCommentFromUser,
    removeAttractionFromUserByAdmin,
    addAttractionIdToUserWhenAddComment,
    getUserByEmail
}