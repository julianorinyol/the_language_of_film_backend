import app  from './app';
import DatabaseHelper from './databaseHelper'

const port: Number = Number(process.env.PORT)

app.set("port", port);
DatabaseHelper.initializeDatabase().then(() => {
	app.listen(port, () => console.log(`Example app listening on port ${port}!`))	
})


