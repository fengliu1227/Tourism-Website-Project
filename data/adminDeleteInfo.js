const { ObjectId } = require('mongodb');

const mongoCollections = require("../config/mongoCollections");
const adminDeleteInfo = mongoCollections.adminDeleteInfo;

async function getAdminByEmail(email) {
    if (!email) throw 'You must provide an email';
    if (typeof email !== 'string' || email.trim().length == 0) throw 'Email is not valid';

    const adminCollection = await adminDeleteInfo();

    // let parsedId = ObjectId(id);
    // console.log('Parsed it correctly, now I can pass parsedId into my query.');

    const getAdmin = await adminCollection.findOne({ email: email });
    if (getAdmin === null) throw 'No admin with that email';
    // getAdmin._id = getAdmin._id.toString();

    return getAdmin;
}

async function createAdmin(email) {
    if (!email) throw 'Please provide email'
    let reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/;
    if (!reg.test(email)) throw 'Email is not valid';

    const adminCollection = await adminDeleteInfo();

    let adminInfo = {
        email: email,
        deleteInfo: []
    }

    const newInsertInformation = await adminCollection.insertOne(adminInfo);
    if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';

    const newId = newInsertInformation.insertedId.toString();

    const admin = await this.getAdminByEmail(newId);
    admin._id = admin._id.toString();
    return admin;
}

async function updateDeleteInfo(email, deleteInfo) {
    if (!email) throw 'Please provide an email';
    if (typeof email !== 'string' || email.trim().length == 0) throw 'Email is not valid';

    const adminCollection = await adminDeleteInfo();
    const updatedAdminInfo = {};
    // let parsedId = ObjectId(id);
    const oldInfo = await this.getAdminByEmail(email);

    if (deleteInfo) {
        updatedAdminInfo.deleteInfo = oldInfo.deleteInfo.concat(deleteInfo);
    };
    await adminCollection.updateOne({ email: email }, { $set: updatedAdminInfo });

    return await this.getAdminByEmail(email);
}

module.exports = {
    getAdminByEmail,
    createAdmin,
    updateDeleteInfo
}