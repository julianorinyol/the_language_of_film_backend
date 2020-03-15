const request = require('supertest');
import app, {API_VERSION_STRING} from '../../src/app'
import DatabaseHelper from '../../src/databaseHelper'
const { mockRequest, mockResponse } = require('../util/interceptor')
import { FilmController } from '../../src/controllers/Films'

const filmsBaseUrl = `${API_VERSION_STRING}/films`
const loginUrl = `${API_VERSION_STRING}/login`


const login = (user:UserData) => agent.post(loginUrl)
        .send(user)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .then((response: any) => response.body.token)

const filmsResponse = [
    { name: 'bla', img: 'defaultimage'},
    { name: 'blar', img: 'defaultimage' } 
]

import { User, UserData } from '../../src/models/User'

const usersData: UserData[] = [
    { 
        email: 'julian@bla.com', 
        password: `password123`
    }
]

let existingId: string = ''

import express = require('express')

//Importing as an object so i can spyOn methods https://stackoverflow.com/questions/27323031/how-to-mock-dependencies-for-unit-tests-with-es6-modules/38414160#38414160
import * as FilmModel from '../../src/models/Film';


let server:any;
let agent:any;
let userJWTToken:any;
let token:any;

describe('film controller', () => {
    beforeAll(async (done) => {
        await DatabaseHelper.initializeDatabase();

        for(const rawFilm of filmsResponse) {
            await new FilmModel.Film(rawFilm).save();;
        }

        const film1 = await FilmModel.Film.find().then(res => res[0])
        // @ts-ignore
        existingId = film1._id



        for(const userData of usersData) {
            await new User(userData).save()
        }


        const user1 = await User.find().then((res:any) => res[0])

        return done()
    });

    afterAll((done) => {
        return DatabaseHelper.dropDatabase().then(DatabaseHelper.closeConnection)
    });

    beforeEach((done) => {
        server = app.listen(4000, async (err: Error) => {
          if (err) return done(err);
    
           agent = request.agent(server); // since the application is already listening, it should use the allocated port
           token = await login(usersData[0])
           done();
        });
    });
    
    afterEach((done) => {
      server && server.close();
      return done()
    });
    
    describe('find()', () => {
        it(`should respond with a 401 ERROR  when Authorization Header is not included`, () => {
            expect.assertions(1)
            return agent.get(filmsBaseUrl)
            .then((response: any) => {
                return expect(response.statusCode).toBe(401)
            })
        })

        // test code implementation
        it('should call status() with 200 and json() with the correct response object - controller function called directly', async (done) => {
            expect.assertions(3)
            const req = mockRequest();
            const res = mockResponse();
            
            jest.spyOn(FilmModel.Film, 'find')
                // @ts-ignore
                .mockImplementationOnce(() => {
                    return Promise.resolve().then(() => {
                        return filmsResponse
                    })
                })
            
            await FilmController.find(req, res);

            expect(res.json.mock.calls.length).toBe(1);
            //TODO when database is set up, create test db in "beforeAll"... 
            //and seed it with test data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(filmsResponse);
            return done()
        })

        it('should return status code 200 - when called via endpoint', () => {
            return agent.get(filmsBaseUrl)
            .set(`Authorization`, `bearer ${token}`)
            .then((response: any) => {
                return expect(response.statusCode).toBe(200)
            })
        });

        it('should return an object with film objects as values - when called via endpoint ', () => {
            expect.assertions(3)
            return agent.get(filmsBaseUrl)
                .set(`Authorization`, `bearer ${token}`)
                .then( async (response: any) => {
                    //TODO when database is set up, create test db in "beforeAll"... 
                    //and seed it with test data
                    const films: {name: string}[] = response.body
                    films.forEach(film => {
                        expect(film.name).toEqual(expect.any(String))
                    })
                    const responseBody = JSON.stringify(response.body)

                    return expect(JSON.stringify(response.body)).toEqual(JSON.stringify(filmsResponse))
                })
        });

        it('should return film objects without the __v field - when called via endpoint ', (done) => {
            return agent.get(filmsBaseUrl).set(`Authorization`, `bearer ${token}`)
                .then( async (response: any) => {
                    //TODO when database is set up, create test db in "beforeAll"... 
                    //and seed it with test data
                    const films: any[] = response.body
                    
                    films.forEach(film => {
                        expect(film['__v']).toBeUndefined();
                    })
                    return done()
                })
        });
    })

    describe('get()', () => {
        it(`should respond with a 401 ERROR  when Authorization Header is not included`, () => {
            expect.assertions(1)
            return agent.get(`${filmsBaseUrl}/${existingId}`)
            .then((response: any) => {
                return expect(response.statusCode).toBe(401)
            })
        })

        it('should call status() with 200 and json() with the correct response object when called with existing id - controller function called directly', async (done) => {
            expect.assertions(3)
            let req = mockRequest();
            req.params = { filmId: existingId }
            const res = mockResponse();

            await FilmController.get(req, res);

            expect(res.json.mock.calls.length).toBe(1);
            expect(res.status).toHaveBeenCalledWith(200);
            //TODO when database is set up, create test db in "beforeAll"... 
            //and seed it with test data
            expect(res.json).toHaveBeenCalledWith(filmsResponse[0]);
            return done()
        })

        it('should call res.status() with 404 when given an id that doesnt exist - controller function called directly', async (done) => {        
            expect.assertions(2)
            let req = mockRequest();
            req.params = { filmId: 'i_dont_exist' }
            const res = mockResponse();

            const response = await FilmController.get(req, res);    

            expect(res.status).toHaveBeenCalledWith(404);
            
            const expectedResponseBody = {
                error: `There is no film with id i_dont_exist`,
            }

            expect(res.json).toHaveBeenCalledWith(expectedResponseBody);
            return done()
        })

        it('should return status code 200 - when called via endpoint with an existing id', () => {
            return agent.get(`${filmsBaseUrl}/${existingId}`).set(`Authorization`, `bearer ${token}`).then((response: any) => {
                return expect(response.statusCode).toBe(200)
            })
        });

        it('should return status code 404 - when called via endpoint with a NON-existant id', () => {
            return agent.get(`${filmsBaseUrl}/fake_id_here`).set(`Authorization`, `bearer ${token}`).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
    
    // These regular REST routes, should not exist... yet at least.
    describe('create() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            return agent.post(filmsBaseUrl, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })

    describe('update() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            return agent.put(`${filmsBaseUrl}/${existingId}`, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })

    describe('patch() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            return agent.patch(`${filmsBaseUrl}/${existingId}`, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
    
    describe('delete() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            return agent.del(`${filmsBaseUrl}/${existingId}`).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
})