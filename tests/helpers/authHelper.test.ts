import bcrypt from 'bcryptjs'
import { comparePassword } from '../../src/helpers/authHelper'
describe(`comparePassword`, () => {
    it(`should return true if password is correct`, async () => {
        const password = 'hunter9'
        const salt = bcrypt.genSaltSync(10);
        const expected = await bcrypt.hash(password, salt)
        const isValid = await comparePassword(password, expected)
        return expect(isValid).toBe(true)
    })

    it(`should return false if password is incorrect`, async () => {
        const password = 'hunter9'
        const password2 = 'hunter10'
        const salt = bcrypt.genSaltSync(10);
        const expected = await bcrypt.hash(password, salt)
        const isValid = await comparePassword(password2, expected)
        return expect(isValid).toBe(false)
    })
})