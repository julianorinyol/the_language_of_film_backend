const request = require('supertest');
import app from '../../src/app'
const { mockRequest, mockResponse } = require('util/interceptor')
const { showFilmController } = require('../../src/routes/Films')
const apiVersionPrefix: string = `/api/v1`

import express = require('express')

describe('film controller', () => {
	it('should be controlling stuff!!', async () => {		
		let req = mockRequest();
		req.params = { filmId: 'fakemovie1' }
		const res = mockResponse();

		await showFilmController(req, res);

		expect(res.send).toHaveBeenCalledTimes(1)
		expect(res.send.mock.calls.length).toBe(1);
		//TODO when database is set up, create test db in "beforeAll"... 
        //and seed it with test data
		const expectedResponseBody = {"name": "fake movie 1"}
		expect(res.send).toHaveBeenCalledWith(expectedResponseBody);
	}) 
})

describe('Test the films/ get all path', () => {
    test('It should return status code 200', () => {
        return request(app).get(`${apiVersionPrefix}/films`).then((response: any) => {
            return expect(response.statusCode).toBe(200)
        })
    });

    test('It should return a dictionary object with film objects as values ', () => {
        return request(app).get(`${apiVersionPrefix}/films`).then( async (response: any) => {
            console.log(response.body)
            //TODO when database is set up, create test db in "beforeAll"... 
            //and seed it with test data
            const expectedResponse =  { 
            	films:	{
   					fakemovie1: { name: 'fake movie 1' },
     				fakemovie2: { name: 'fake movie 2' } 
     			}
         	}
			expect(response.body).toMatchObject(expectedResponse)
        })
    });
})