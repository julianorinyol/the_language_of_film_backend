import DatabaseHelper from '../src/databaseHelper'
const LIST_COMMAND: 'list' = 'list'

const command = process.argv[2]
DatabaseHelper.initializeDatabase()
.then(() => {
    if(command === LIST_COMMAND) {
        return DatabaseHelper.listCollections()
    } else {
        throw new Error(`Unknown command passed to databaseCli ${command}`)
    }
	
})
.then(() => DatabaseHelper.closeConnection())