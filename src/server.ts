import app  from './app';
import DatabaseHelper from './databaseHelper'

const port: Number = Number(process.env.PORT)

app.set("port", port);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

DatabaseHelper.initializeDatabase()