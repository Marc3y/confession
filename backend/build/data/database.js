"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.initDatabase = exports.MongoClient = exports.Database = void 0;
const mongodb_1 = require("mongodb");
Object.defineProperty(exports, "MongoClient", { enumerable: true, get: function () { return mongodb_1.MongoClient; } });
let database;
const initDatabase = () => {
    exports.database = database = new Database();
};
exports.initDatabase = initDatabase;
class Database {
    constructor() {
        this.mongoClient = new mongodb_1.MongoClient("mongodb://marceybot:eDaG4I2WKBjy17yFAlWlElpFuBNWeCRO0czgaaY9Nz3pkqTo6u@127.0.0.1:27017/?authMechanism=SCRAM-SHA-256&authSource=marceybot", {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.connect();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongoClient.connect();
        });
    }
    getCollection(collection, db) {
        return __awaiter(this, void 0, void 0, function* () {
            let col = yield this.mongoClient.db(!db ? "marceybot" : db).collection(collection);
            return col;
        });
    }
    insert(collectionName, insertData) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            yield collection.insertOne(insertData);
        });
    }
    update(collectionName, findData, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            yield collection.updateOne(findData, { $set: updateData });
        });
    }
    delete(collectionName, findData) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            yield collection.findOneAndDelete(findData);
        });
    }
    getDocument(collectionName, findData) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            let result = yield collection.findOne(findData);
            return result;
        });
    }
    getDocuments(collectionName, findData) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            let result = yield collection.find(findData).toArray();
            return result;
        });
    }
    getAllDocuments(collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            let collection = yield this.getCollection(collectionName);
            let result = yield collection.find({}).toArray();
            return result;
        });
    }
}
exports.Database = Database;
