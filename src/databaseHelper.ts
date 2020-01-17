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
    }
}

export default DatabaseHelper