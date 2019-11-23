import mongoose, {Document, model, Model, Schema} from 'mongoose';

const mongoConnectionPrefix: string = `mongodb://`
const DatabaseHelper = {
    initializeDatabase(connectionString?: string) {
        if(!connectionString) {
            connectionString = `${mongoConnectionPrefix}${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`
        }
        console.log(`Connecting to database: ${connectionString}`)
        mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(  () => { 
            console.log(`Database connection complete.`)
        }).catch(err => {
            console.error(`Database connection error ${err.message}`)
        })
    },
    dropDatabase(cb:Function) {
        console.log(`Dropping the database.`)
        mongoose.connection.db.dropDatabase();
        if(cb) cb()
    }
}

export default DatabaseHelper