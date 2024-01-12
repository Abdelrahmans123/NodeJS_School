const { log } = require('console');
const {MongoClient}=require('mongodb')
const url="mongodb+srv://sabdelrahman:NodeJS_123@learnmongodb.pn9weqn.mongodb.net/?retryWrites=true&w=majority"
const client=new MongoClient(url);
const main=async () => {
await client.connect();
console.log("Connected to MongoDB server Success");
const db=client.db('School');
const collection=db.collection('courses');
await collection.insertOne({
    name:"NodeJS",
});
const data=await collection.find().toArray();
console.log(data);
}
main();