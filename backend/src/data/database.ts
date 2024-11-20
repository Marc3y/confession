import {MongoClient} from "mongodb";

let database:Database;

const initDatabase = () => {
    database = new Database();
};

class Database {
    mongoClient:MongoClient;
    constructor() {
        this.mongoClient = new MongoClient(
            "mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot",
            {
                // @ts-ignore
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        this.connect();
    }
    async connect(){
        await this.mongoClient.connect();
    }
    async getCollection(collection:string, db?:string){
        let col = await this.mongoClient.db(!db ? "marceybot" : db).collection(collection);
        return col;
    }

    async insert(collectionName:string, insertData:any){
        let collection = await this.getCollection(collectionName);
        await collection.insertOne(insertData);
    }

    async update(collectionName:string, findData:any, updateData:any){
        let collection = await this.getCollection(collectionName);
        await collection.updateOne(findData, {$set: updateData});
    }

    async delete(collectionName:string, findData:any){
        let collection = await this.getCollection(collectionName);
        await collection.findOneAndDelete(findData);
    }


    async getDocument(collectionName:string, findData:any){
        let collection = await this.getCollection(collectionName);
        let result = await collection.findOne(findData);
        return result;
    }

    async getDocuments(collectionName:string, findData:any){
        let collection = await this.getCollection(collectionName);
        let result = await collection.find(findData).toArray();
        return result;
    }

    async getAllDocuments(collectionName:string){
        let collection = await this.getCollection(collectionName);
        let result = await collection.find({}).toArray();
        return result;
    }
}

export {Database, MongoClient, initDatabase, database};