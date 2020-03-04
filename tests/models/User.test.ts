import { User, UserDocument } from '../../src/models/User'
import DatabaseHelper from '../../src/databaseHelper'

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

describe(`User`, () => {
    beforeAll(async (done) => {
        await DatabaseHelper.initializeDatabase();
        for(const rawData of userData) {
            const usersRes = await User.find({email: rawData.email})
            // if the tests were exited before the afterAll could cleanup, then the user might exist
            users.push(usersRes.length > 0 ? usersRes[0] : await new User(rawData).save())
        }

        return done()
    })

    afterAll(async (done) => {
        return Promise.all(users.map(user => {
            return user.remove()
        })).then(done)
    })
    
    it(`should hash the password on save`, () => {
        expect(users[0].email).toEqual(userData[0].email)
        expect(users[0].password).not.toEqual(userData[0].password)
    })

    it(`should give two users with the same password, different hashes`, () => {
        expect(users[0].password).not.toEqual(users[1].password)
    })
})