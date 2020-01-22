
import express = require('express')
import mongoose from 'mongoose'


import { Film, FilmData} from "../src/models/Film";
import { Word, WordData } from '../src/models/Word';
import { Translation, TranslationData } from '../src/models/Translation';
import DatabaseHelper from '../src/databaseHelper'
const defaultFilmImage = 'https://images.all-free-download.com/images/graphiclarge/movie_poster_background_art_vector_530172.jpg'

const filmsData: FilmData [] = [
    {
		name: 'movie 1',
		img: defaultFilmImage
	},
    { 
		name: 'movie 2',
		img: defaultFilmImage 
	} 
]



const LANGUAGE_ENGLISH: 'english' = 'english'
const LANGUAGE_GERMAN: 'german' = 'german'
const LANGUAGE_SPANISH: 'spanish' = 'spanish'


const word1Id = new mongoose.Types.ObjectId()
const word2Id = new mongoose.Types.ObjectId()
const word3Id = new mongoose.Types.ObjectId()

const wordsData: WordData[] = [
	{ 
		_id: word1Id,
		word: 'verdammte', 
		language: LANGUAGE_GERMAN,
		translations: [ word2Id, word3Id ]
	},
	{ 
		_id: word2Id,
		word: 'damned', 
		language: LANGUAGE_ENGLISH,
		translations: [ word1Id, word3Id ]
	},
	{ 
		_id: word3Id,
		word: 'maldita', 
		language: LANGUAGE_SPANISH,
		translations: [ word1Id, word2Id ]
	}
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