const request = require('supertest');
import * as jwt from "jsonwebtoken";
import app, {API_VERSION_STRING} from '../../src/app'
import DatabaseHelper from '../../src/databaseHelper'
import { User, UserDocument } from '../../src/models/User'
import { JWT_SECRET } from "../../src/helpers/secretsHelper";
const loginUrl = `${API_VERSION_STRING}/login`

let server:any;
let agent:any;

const userData = [
    {
        email: `julian@bla.com`,
        password: `hunter23`
    },
    {
        email: `fakeperson@bla.com`,
        password: `hunter23`
    }
]
const users: UserDocument[] = []

describe(`LoginController`, () => {
    beforeAll(async (done) => {
        await DatabaseHelper.initializeDatabase();
        for(const rawData of userData) {
            const usersRes = await User.find({email: rawData.email})
            // if the tests were exited before the afterAll could cleanup, then the user might exist
            users.push(usersRes.length > 0 ? usersRes[0] : await new User(rawData).save())
        }

        return done()
    })
    beforeEach((done) => {
        server = app.listen(4000, (err: Error) => {
          if (err) return done(err);
    
           agent = request.agent(server); // since the application is already listening, it should use the allocated port
           return done();
        });
    });
    
    afterEach((done) => {
        server && server.close();
        return done()
    });

    afterAll((done) => {
        // return Promise.all(users.map(user => {
        //     return user.remove()
        // })).then(done)
        return DatabaseHelper.dropDatabase().then(DatabaseHelper.closeConnection).then(done)

    })

    describe(`authenticateUser`, () => {
        it(`should respond with a 200 OK when requested with valid credentials, and JWT token is returned`, (done) => {
            expect.assertions(6)
            const user = userData[0]

            return agent.post(loginUrl)
            .send(user)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response: any) => {
                expect(response.body).toHaveProperty('token')
                
                const token = response.body.token
                const verifiedToken: any = jwt.verify(token, JWT_SECRET, {complete: true});
                

                if('payload' in verifiedToken && 'username' in verifiedToken.payload && 'iat' in verifiedToken.payload) {
                    expect(verifiedToken.payload.username).toEqual(user.email)
                    // todo: change this to verify that its a proper unix time string.
                    expect(verifiedToken.payload).toHaveProperty('iat')
                }

                if('header' in verifiedToken && 'typ' in verifiedToken.header && 'alg' in verifiedToken.header) {
                    expect(verifiedToken.header.typ).toEqual(`JWT`)
                    expect(verifiedToken.header.alg).toEqual(`HS256`)
                }
                
                return expect(response.statusCode).toBe(200)
            }).then(() => {
                return done()
            })
        })

        it(`should respond with a 401 ERROR  when requested with invalid credentials`, (done) => {
            const user = userData[0]
            user.password = 'not the real one'

            return agent.post(loginUrl)
            .send(user)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .then((response: any) => {
                expect(response.error.text).toBe('{"status":"error","code":"unauthorized"}')
                return expect(response.statusCode).toBe(401)
                
            }).then(() => {
                return done()
            })
        })
    })
})
