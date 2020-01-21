
import express = require('express')

import { Film, FilmData} from "../src/models/Film";
import { Word, WordData } from '../src/models/Word';
import DatabaseHelper from '../src/databaseHelper'
const defaultFilmImage = 'https://images.all-free-download.com/images/graphiclarge/movie_poster_background_art_vector_530172.jpg'

const filmsData: FilmData[] = [
    { name: 'movie 1', img: defaultFilmImage},
    { name: 'movie 2', img: defaultFilmImage } 
]

const LANGUAGE_ENGLISH: 'english' = 'english'
const LANGUAGE_GERMAN: 'german' = 'german'



const wordsData: WordData[] = [
	{ word: 'verdammte', language: LANGUAGE_GERMAN },
	{ word: 'damned', language: LANGUAGE_ENGLISH }
]

const createItems = (Model: any, data:any, name: string) => {
	return Promise.all(data.map(async (rawItem:any) => {
	    return new Model(rawItem).save()
	    	.catch( (err:any)=> {
	    		console.log(`error saving ${name}`, err)
	    		throw err
	    	})
	})).catch(err => {
		console.log(`error in ${name} seeding process`, err)
		throw err
	})
}



DatabaseHelper.initializeDatabase()
.then(() => {
	return DatabaseHelper.dropCollections(['films', 'words'])
})
.then(() => createItems(Film, filmsData, `film`))
.then(() => createItems(Word, wordsData, `word`))
.then(() => DatabaseHelper.closeConnection())
.catch((err) => {
	console.error(`Error seeding: `, err)
})