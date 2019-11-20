const express = require('express')
const app = express()
const port = 8000
const films = {
	'herr_lehman': "bla",
	'fakemovie': "blar"
}
const filmIds = Object.keys(films)
app.get('/', (req, res) => res.send('Hello World!'))

app.get('/films', (req, res) => res.send(filmIds))

app.get('/films/:filmId', (req, res) => {
	const { filmId } = req.params
	if(!(filmId in films)) {
		return res.status(404).send(`There is no film with id ${filmId}`)
	}

	return res.send(films[filmId])
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))