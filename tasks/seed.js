
const dbConnection = require('../config/mongoConnections');
const data = require('../data/');
const users = data.users;
const admin = data.adminDeleteInfo;
const attraction = data.attractions;

const main = async () => {
    console.log("Initializing...Please wait")
    const db = await dbConnection();
    await db.dropDatabase();
    await users.createUser("admin@outlook.com","12345",{firstName:"admin",lastName:"admin"},"other");
    await admin.createAdmin("admin@outlook.com");
    console.log("admin"+ "finished!");
    const userList = [];
    console.log("There are 10 users initialization!")
    for(let i = 0; i < 10; i++){
     userList[i] = await users.createUser("user"+i+"@outlook.com","12345",{firstName:"user",lastName:i},"Male");
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
    descriptions.push({
        Name:"Musée du Louvre",
        Category:"Buidling",
        Rating:"4",
        Img:"https://www.planetware.com/photos-large/F/france-paris-louvre.jpg",
        Price:"35",
        Content:"A sumptuous palace that was once the home of France's Kings, the Louvre is the most important of Paris' top museums. Visitors enter the museum in the courtyard of the palace at the glass pyramid (designed by Ieoh Ming Pei in 1917).",
        Address:"Louvre"
    });
    descriptions.push({
        Name:"Elephant Trunk Hill",
        Category:"Nature",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cms/li-river-cruise-guide-elephant-trunk-hill-1561543636-735X412.jpg",
        Price:"15",
        Content:"The unofficial mascot of Guilin, Elephant Trunk Hill sits at the confluence of the Li River and the Peach Blossom River. This magnificent karst formation resembles an elephant dipping its trunk into the river and has been a tourist draw since the days of the Tang Dynasty (618 AD – 904 AD).",
        Address:"Yunnan China"
    });
    descriptions.push({
        Name:"Great Wall",
        Category:"Culture",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cmsfeatured/visiting-the-great-wall-of-china-featured-image-1560845062-785X440.jpg",
        Price:"10",
        Content:"One of the most popular attractions in the country, this series of defense fortifications known as the Great Wall of China is an iconic landmark that snakes its way along the northern borders of China. ",
        Address:"China"
    });
    descriptions.push({
        Name:"Manaslu Circuit Trekking",
        Category:"Nature",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/resized/750x420/16-days-manaslu-circuit-trekking-tour-2-17984_1559833743.JPG",
        Price:"875",
        Content:"This 16-day Manaslu Trek (also known as the Manaslu Circuit Trek) is a remote trek around Manaslu, eighth highest peak in the world. This is a relatively new trekking route and is gaining popularity among trekkers all over.",
        Address:"Kathmandu, Nepa"
    });
    descriptions.push({
        Name:"Stevens Institue of Technology",
        Category:"Education",
        Rating:"5",
        Img:"https://pbs.twimg.com/profile_images/571322986754351104/Yqdgr872.jpeg",
        Price:"875",
        Content:"Stevens Institute of Technology is a private research university in Hoboken, New Jersey. Incorporated in 1870, it is one of the oldest technological universities in the United States and was the first college in America solely dedicated to mechanical engineering.[7] The campus encompasses Castle Point, the highest point in Hoboken, and several other buildings around the city.",
        Address:"Hoboken, New Jersey, United States"
    });
    descriptions.push({
        Name:"Serengeti, Manyara, Ngorongoro Safari Tour",
        Category:"Nature",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/resized/750x420/4-days-serengeti-manyara-ngorongoro-safari-tour-tour-2-18795_1537506546.JPG",
        Price:"762",
        Content:"This 4 Days Serengeti, Manyara, Ngorongoro Crater Safari Tour will take you through the Northern Safari Circuit in Tanzania. Primarily, you will be visiting Serengeti National Park, Lake Manyara National Park and the Ngorongoro Crater. ",
        Address:"Arusha, Tanzania"
    });
    descriptions.push({
        Name:"Land of the Northern Lights",
        Category:"Nature",
        Rating:"1",
        Img:"https://d3hne3c382ip58.cloudfront.net/resized/750x420/land-of-the-northern-lights-5-days-tour-2-425307_1606811665.JPG",
        Price:"1040",
        Content:"Starting and ending in Reykjavik, the trip Land Of The Northern Lights - 5 Days is a guided natural landmarks sightseeing trip that takes 5 days. You will travel through Thingvellir National Park, Blue Lagoon, Eyjafjallajökull and 6 other destinations in Iceland. Land Of The Northern Lights - 5 Days is a group trip which includes accommodation in hotels, transport, meals and others.",
        Address:"Reykjavik, Iceland"
    });
    descriptions.push({
        Name:"Northern Lights Escape",
        Category:"Nature",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/resized/750x420/northern-lights-escape-tour-2-409340_1553147989.JPG",
        Price:"1620",
        Content:"Starting and ending in Reykjavik, the Northern Lights Escape trip is a guided northern lights tour that takes 6 days. You will travel through Thingvellir National Park, Skogafoss Waterfall, Hvolsvollur and 6 other destinations in Iceland. Northern Lights Escape is a small group trip which includes accommodation, transport, meals and others.",
        Address:"Reykjavik, Iceland"
    });
    descriptions.push({
        Name:"Sri Lanka Tour",
        Category:"Nature",
        Rating:"5",
        Img:"https://d3hne3c382ip58.cloudfront.net/resized/750x420/best-of-sri-lanka-tour-tour-2-421634_1591784488.JPG",
        Price:"763",
        Content:"Head for Kandy, the cultural capital of Sri Lanka. Take a walk through the forest of Udawattekele. Learn more about tea production in Sri Lanka during a visit to Nuwara Eliya and ride a train from Nanu Oya to Ella (seats are subject to availability). Enjoy hiking in Ella Rock and Little Adams Peak.",
        Address:"Katunayake, Sri Lanka"
    });
    console.log(userList[0]);
    let index = 0;
    for(let i = 0 ; i < descriptions.length; i++){
        await attraction.addAttractions(userList[index]._id,descriptions[i]);
        if(i % 2 == 0) index++;
    }
    const attractionList = await attraction.getAllAttraction();
    console.log(attractionList);
    
  console.log("seeds finished!");
};

main().catch(console.log);
