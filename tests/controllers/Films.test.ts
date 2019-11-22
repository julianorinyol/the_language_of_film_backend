const request = require('supertest');
import app from '../../src/app'
const { mockRequest, mockResponse } = require('../util/interceptor')
// const { get } = require('../../src/controllers/Films')
import { FilmController } from '../../src/controllers/Films'
const apiVersionPrefix: string = `/api/v1`
const filmsBaseUrl = `${apiVersionPrefix}/films`
const filmsResponse = { 
    films:    {
        fakemovie1: { name: 'fake movie 1' },
        fakemovie2: { name: 'fake movie 2' } 
    }
}

import express = require('express')

describe('film controller', () => {
    describe('find()', () => {
        // test code implementation
        it('should call status() with 200 and json() with the correct response object - controller function called directly', async () => {
            expect.assertions(3)
            const req = mockRequest();
            const res = mockResponse();

            await FilmController.find(req, res);

            expect(res.json.mock.calls.length).toBe(1);
            //TODO when database is set up, create test db in "beforeAll"... 
            //and seed it with test data
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(filmsResponse);
        })

        it('should return status code 200 - when called via endpoint', () => {
            return request(app).get(filmsBaseUrl).then((response: any) => {
                return expect(response.statusCode).toBe(200)
            })
        });

        it('should return an object with film objects as values - when called via endpoint ', () => {
            return request(app).get(filmsBaseUrl).then( async (response: any) => {
                //TODO when database is set up, create test db in "beforeAll"... 
                //and seed it with test data
                const films: {name: string}[] = response.body.films
                for(const filmId in films) {
                    const film = films[filmId]
                    expect(film.name).toEqual(expect.any(String))
                }
                expect(response.body).toMatchObject(filmsResponse)
            })
        });
    })

    describe('get()', () => {
        it('should call status() with 200 and json() with the correct response object when called with existing id - controller function called directly', async () => {
            expect.assertions(3)
            let req = mockRequest();
            req.params = { filmId: 'fakemovie1' }
            const res = mockResponse();

            await FilmController.get(req, res);

            
            expect(res.send.mock.calls.length).toBe(1);
            expect(res.status).toHaveBeenCalledWith(200);
            //TODO when database is set up, create test db in "beforeAll"... 
            //and seed it with test data
            const expectedResponseBody = {"name": "fake movie 1"}
            expect(res.send).toHaveBeenCalledWith(expectedResponseBody);
        })

        it('should call res.status() with 404 when given an id that doesnt exist - controller function called directly', async () => {        
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
        })

        it('should return status code 200 - when called via endpoint with an existing id', () => {
            const existingId = Object.keys(filmsResponse.films)[0]
            return request(app).get(`${filmsBaseUrl}/${existingId}`).then((response: any) => {
                return expect(response.statusCode).toBe(200)
            })
        });
        it('should return status code 404 - when called via endpoint with a NON-existant id', () => {
            return request(app).get(`${filmsBaseUrl}/fake_id_here`).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
    
    // These regular REST routes, should not exist... yet at least.
    describe('create() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            const existingId = Object.keys(filmsResponse.films)[0]
            return request(app).post(filmsBaseUrl, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })

    describe('update() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            const existingId = Object.keys(filmsResponse.films)[0]
            return request(app).put(`${filmsBaseUrl}/${existingId}`, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })

    describe('patch() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            const existingId = Object.keys(filmsResponse.films)[0]
            return request(app).patch(`${filmsBaseUrl}/${existingId}`, { name: 'new name' }).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
    
    describe('delete() - should not exist', () => {
        it('should return status code 404 - as its not defined', () => {
            const existingId = Object.keys(filmsResponse.films)[0]
            return request(app).del(`${filmsBaseUrl}/${existingId}`).then((response: any) => {
                return expect(response.statusCode).toBe(404)
            })
        });
    })
})