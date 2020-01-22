import DatabaseHelper from '../src/databaseHelper'
const LIST_COMMAND: 'listCollections' = 'listCollections'

const help = ():void => {
    const helpMessage = `
        available commands:

        yarn db listCollections
    `
    console.log(helpMessage)
}

if(process.argv.length < 3) {
    help()
    throw new Error(`No command passed to databaseCli`)
}

const command = process.argv[2]


DatabaseHelper.initializeDatabase()
.then(async () => {
    if(command === LIST_COMMAND) {
        return DatabaseHelper.listCollections()
   } else {
        help()
        throw new Error(`Unknown command passed to databaseCli ${command}`)
    }
	
})
.then(() => DatabaseHelper.closeConnection())
.catch(err => {
    console.error(`error with databaseCli command was: ${command}`, err)
})