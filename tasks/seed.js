
const dbConnection = require('../config/mongoConnections');
const data = require('../data/');
const users = data.users;
const admin = data.adminDeleteInfo;
const attraction = data.attractions;

const main = async () => {
    console.log("Initializing...Please wait")
    const db = await dbConnection();
    await db.dropDatabase();
    await users.createUser("admin@outlook.com","12345","admin","admin");
    await admin.createAdmin("admin@outlook.com");
    console.log("admin"+ "finished!");
    const userList = [];
    console.log("There are 10 users initialization!")
    for(let i = 1; i < 10; i++){
     userList[i] = await users.createUser("user"+i+"@outlook.com","12345","user"+i,"user"+i);
     console.log("user"+i+" finished!");
    }
    const descriptions = [];
    



  
  
  
  console.log("seeds finished!");
};

main().catch(console.log);
