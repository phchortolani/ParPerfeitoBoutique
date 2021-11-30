import { MongoClient} from 'mongodb';
import url from 'url';

let cacheDb = undefined;

export async function connectToDataBase(uri) {

    if (!cacheDb) {
        const client = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        const dbname = url.parse(uri).pathname.substr(1);
        const db = client.db(dbname);

        cacheDb = db;

        return db;
    } else {
        return cacheDb;
    }
}

