const users = require('./data/users');
const connection = require('./config/mongoConnection');
const { use } = require('./routes/users');

const main = async () => {
    const one = await users.createUser('yANg953350978@outlook.com', 'bukx')
    console.log(one);

    // const two = await users.updateUser('5fc6fce30d4279542647084c', {
    //     userName: { firstName: 'xiaolin', lastName: 'yang' },
    //     email: 'yang50978@outlook.com',
    //     gender: 'male',
    //     password: '$2b$16$91Xme4JtEEPSrAZDTyj9ne555WuWGCYlAViG9/jdskTvJoNyuukVa',
    //     privilege: 0,
    //     commentId: ['viyvasclnv'],
    //     spotsId: ['ksvcaiyvce'],
    //     travelogueId: ['aysvciya', 'iasycviyav']
    // })
    const getAll = await users.getAllUsers();
    console.log(getAll);

    // const deleteOne = await users.deleteUser('5fc6fce30d4279542647084c')

    // const upd = await books.books.updateBook('5f8cce7a4bbd78fa139d6d3d', { 
    //     "title": "The Shining UPDATED",
    //     "author": {"authorFirstName": "Patrick", "authorLastName": "Hill"},
    //     "genre": ["Novel", "Horror fiction", "Gothic fiction", "Psychological horror", "Occult Fiction"],
    //     "datePublished": "1/28/1977",
    //     "summary": "Torrance’s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he’ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote . . . and more sinister. And the only one to notice the strange and terrible forces gathering around the Overlook is Danny Torrance, a uniquely gifted five-year-old.."
    //   });
    // console.log(upd);

    // const find = await books.books.getBookById('5f8b645cd7e49ee3923bec80');
    // console.log(find)

    // const review1 = await reviews.reviews.getAllReviews('5f8b9f1a830bb0e7b24fd4c2');
    // console.log(review1)

    // const reviewid = await reviews.reviews.getReviewById('5f8c82b853333af059875e81');
    // console.log(reviewid)

    // const newReview = await reviews.reviews.createReview("new", "xiaolinyang", "5f8d33707956110587b2c399", 5, "09/27/1996", "good!");
    // console.log(newReview)

    // const deleteR = await reviews.reviews.deleteReview('5f8d28dac0346003f4f4a768');
    // console.log(deleteR)
}

main().catch((error) => {
    console.log(error);
})