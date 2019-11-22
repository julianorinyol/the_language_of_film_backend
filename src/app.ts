import { Router, Request, Response } from 'express';

const express = require('express')
const app = express()
const port = 8000

const films: { [key: string]: string } = {
	'herr_lehman': "bla",
	'fakemovie': "blar"
};

const filmIds = Object.keys(films)
app.get('/', (req: Request, res: Response) => res.send('Hello World!'))

app.get('/films', (req: Request, res: Response) => res.send(filmIds))

app.get('/films/:filmId', (req: Request, res: Response) => {
	const { filmId } = req.params
	if(!(filmId in films)) {
		return res.status(404).send(`There is no film with id ${filmId}`)
	}

	return res.send(films[filmId])
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))