
import mongoose from 'mongoose'


import { Film, FilmData} from "../src/models/Film";
import { Word, WordData } from '../src/models/Word';
import { User, UserData } from '../src/models/User';
import { Phrase, PhraseData } from '../src/models/Phrase';
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

const word1Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
const word2Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
const word3Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

const phrase1Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
const phrase2Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()
const phrase3Id: mongoose.Types.ObjectId = new mongoose.Types.ObjectId()

const phrasesData: PhraseData[] = [
	{
		_id: phrase1Id,
		phrase: "Wem gehört der verdammte Scheißhund",
		language: LANGUAGE_GERMAN,
		translations: [ phrase3Id ],
		words: [ word1Id ]
	},
	{
		_id: phrase2Id,
		phrase: "Ich liebe dich Verdammte Scheiße",
		language: LANGUAGE_GERMAN
	},
	{
		_id: phrase3Id,
		phrase: "Who does this fucking dog belong to?",
		language: LANGUAGE_ENGLISH,
		translations: [ phrase1Id ]
	},
]

const wordsData: WordData[] = [
	{ 
		_id: word1Id,
		word: 'verdammte', 
		language: LANGUAGE_GERMAN,
		translations: [ word2Id, word3Id ],
		phrases: [ phrase1Id, phrase2Id ],
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


const usersData: UserData[] = [
	{ 
		email: 'julian@bla.com', 
		password: `password123`
	}
]

const createItems = (Model: any, data:any, name: string) => {
	console.log(`Seeding items for model: ${name}`)
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

console.log(`Opening database connection`)
DatabaseHelper.initializeDatabase()
.then(() => {
	const collectionsToDrop = ['films', 'words', 'phrases', 'users']
	console.log(`Dropping collections: ${collectionsToDrop.join(', ')}`)
	return DatabaseHelper.dropCollections(collectionsToDrop)
})
.then(() => createItems(Film, filmsData, `film`))
.then(() => createItems(Phrase, phrasesData, `phrase`))
.then(() => createItems(Word, wordsData, `word`))
.then(() => createItems(User, usersData, `user`))
.then(() => {
	console.log(`Finished Seeding, closing database connection`)
	return DatabaseHelper.closeConnection()
})
.catch((err) => {
	console.error(`Error seeding: `, err)
})