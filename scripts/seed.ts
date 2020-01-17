
import express = require('express')

//Importing as an object so i can spyOn methods https://stackoverflow.com/questions/27323031/how-to-mock-dependencies-for-unit-tests-with-es6-modules/38414160#38414160
import * as FilmModel from '../src/models/Film';
import DatabaseHelper from '../src/databaseHelper'
const defaultFilmImage = 'https://images.all-free-download.com/images/graphiclarge/movie_poster_background_art_vector_530172.jpg'

const filmsData = [
    { name: 'movie 1', img: defaultFilmImage},
    { name: 'movie 2', img: defaultFilmImage } 
]

const createFilms = () => {
	return Promise.all(filmsData.map(async rawFilm => {
	    return new FilmModel.Film(rawFilm).save()
	    	.catch( err=> {
	    		console.log(`error saving film`, err)
	    		throw err
	    	})
	})).catch(err => {
		console.log(`error in seeding process`, err)
		throw err
	})
}

DatabaseHelper.initializeDatabase().then(() => {
	return FilmModel.Film.deleteMany({}).then(createFilms)
})
