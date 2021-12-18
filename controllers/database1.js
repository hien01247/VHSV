// JavaScript Document
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
module.exports.select=async function(collectionname,query)  {
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if (!client) {
        return;
    }
    try {
        const db = client.db("nhaVH");
        let collection = db.collection(collectionname);
        let res = await collection.find(query).toArray();

		return res;

    } catch (err) {

        console.log(err);
    } finally {

        client.close();
    }
}

module.exports.insert=async function (collectionname,obj){
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if (!client) {
        return;
    }
    try {
        const db = client.db("nhaVH");
        let collection = db.collection(collectionname);
        await collection.insertOne(obj);

		return 1;

    } catch (err) {

        console.log(err);
        return 0;
    } finally {

        client.close();
    }
}
