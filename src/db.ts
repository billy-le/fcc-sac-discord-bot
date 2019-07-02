import config from '../config';
import { MongoClient, ObjectID } from 'mongodb';

const mongoOptions = {
    useNewUrlParser: true,
};
const dbname = 'fcc-sac_dev';

let state = {
    db: null,
};

function getPrimaryKey(_id: string) {
    return new ObjectID(_id);
}

function getDB() {
    return state.db as any;
}

function connect(cb: Function) {
    if (state.db) {
        return cb();
    }
    MongoClient.connect(config.mlab.uri as string, mongoOptions, (err: any, client: any) => {
        if (err) {
            return cb(err);
        }
        state = {
            db: client.db(dbname),
        };
        return cb();
    });
}

export { connect, getDB, getPrimaryKey };
