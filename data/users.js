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
    if (!id) throw 'You must provide an id';
    if (typeof id !== 'string' || id.trim().length == 0) throw 'Id is not valid';

    const usersCollection = await users();

    let parsedId = ObjectId(id);
    // console.log('Parsed it correctly, now I can pass parsedId into my query.');

    const getUser = await usersCollection.findOne({ _id: parsedId });
    if (getUser === null) throw 'No user with that id';
    getUser._id = getUser._id.toString();

    return getUser;
}

async function createUser(email,password,userName,gender) {
    if (!email || !password || !userName || !gender) throw 'Please provide all fields'
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    if (!reg.test(email)) throw 'Email is not valid';
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    email = email.toLowerCase();

    const usersCollection = await users();
    let allUser = await this.getAllUsers();
    for (i in allUser) {
        if (email == allUser[i].email) throw 'This email has been registered'
    }

    let newUser = {
        // _id: uuid(),
        userName: userName,
        email: email,
        gender: gender,
        password: hashedPassword,
        privilege: 0,
        commentId: [],
        spotsId: [],
        travelogueId: []
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
    if (!id) throw 'Please provide an id';
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
    let currentUser = await this.getUserById(userId);
    const newTravelogue = {};
    newTravelogue.travelogue = [];
    let index = 0;
    for (let i of currentUser.travelogueId) {
        if (i.id.toString() == travelogueId) continue;
        newReview.reviews[index++] = i;
    }
    const usersCollection = await users();
    const updateInfo = await usersCollection.updateOne({ _id: ObjectId(userId) }, { $set: newTravelogue });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Error: delete failed';
    return await this.getUserById(userId);
}

module.exports = {
    getAllUsers,
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    addTravelogueToUser,
    removeTravelogueFromUser

}