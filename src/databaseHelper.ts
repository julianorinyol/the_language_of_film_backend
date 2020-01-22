import mongoose, {Document, model, Model, Schema} from 'mongoose';

const mongoConnectionPrefix: string = `mongodb://`
const DatabaseHelper = {
    initializeDatabase(connectionString?: string) {
        if(!connectionString) {
            connectionString = `${mongoConnectionPrefix}${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`
        }
        console.log(`Connecting to database: ${connectionString}`)
        return mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(  (x) => { 
            console.log(`Database connection complete.`)
            return x
        }).catch(err => {
            console.error(`Database connection error ${err.message}`)
        })
    },
    dropDatabase() {
        console.log(`Dropping the database.`)
        return mongoose.connection.db.dropDatabase();
    },
    listCollections():void {
        console.log(`Existing Collections--`)
        mongoose.connection.db.listCollections().toArray()
        .then(collections => {
            collections.forEach((collection)=> {
                console.log(`\n${collection.name}`)
            })
        })
    },
    async dropCollections(collectionsToDrop:string []) {
        const existingCollections = (await mongoose.connection.db.listCollections().toArray()).map(collection => collection.name);
        console.log(`Existing Collections--`, existingCollections)
        for (let i = 0; i < collectionsToDrop.length; i++) {
            if (existingCollections.indexOf(collectionsToDrop[i]) !== -1) {
                await mongoose.connection.db.dropCollection(collectionsToDrop[i]);
            }
        }
    },
    closeConnection() {
        return mongoose.connection.close()
    }
}

export default DatabaseHelper