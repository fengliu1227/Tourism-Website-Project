
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
    console.log("tests");
    await admin.createAdmin("admin@outlook.com");
    console.log("test34");
    console.log("admin"+ "finished!");
    const userList = [];
    console.log("There are 10 users initialization!")
    for(let i = 0; i < 10; i++){
     userList[i] = await users.createUser("user"+i+"@outlook.com","12345","user"+i,"user"+i);
     console.log("user"+i+" finished!");
    }
    const descriptions = [];
    descriptions.push({
        Name:"Eiffel Tower",
        Category:"Culture",
        Rating:"5",
        Img:"https://www.planetware.com/photos-large/F/france-paris-eiffel-tower.jpg",
        Price:"25",
        Content:"The most visited tourist attraction in Paris, the Eiffel Tower also ranks high on the list of places to visit in France. It's hard to believe that the structure was dismissed as a monstrosity when it was first unveiled.",
        Address:"Paris"
    });
    console.log(userList[0]);
    await attraction.addAttractions(userList[0]._id,descriptions[0]);



  
  
  
  console.log("seeds finished!");
};

main().catch(console.log);
