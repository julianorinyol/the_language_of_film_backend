
# Types of tests in this project

* unit testing the controllers using fakes/mocks. 
For an example see: https://github.com/julianorinyol/the_language_of_film_backend/blob/master/tests/controllers/Films.test.ts#L56
For an explanation see:  https://stackoverflow.com/questions/55463886/unit-testing-controllers-use-jest-nodejs
* integration testing the controllers using supertest. IE: run the server, and make requests to it, and test the responses, status codes, body, headers, etc.
For an example see: https://github.com/julianorinyol/the_language_of_film_backend/blob/master/tests/controllers/Films.test.ts#L81
* todo: End to End testing --> Currently working on adding this to the frontend repo https://github.com/julianorinyol/the_language_of_film_frontend. Eventually will have it in both repos pipelines.
