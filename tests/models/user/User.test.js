import { EverDate } from '../../../src/helpers/EverDate.js'
import { precondition } from '../../../src/lib/preconditions.js'
import { User } from '../../../src/models/user/User.js'
import { UserStatus } from '../../../src/models/user/UserStatus.js'
import { assert, suite } from '../../test-config.js'
import { UserMother } from './UserMother.js'

const user = suite('User')

user('should know that valid data is valid', () => {
    const noChanges = {}
    assert.ok(isUserValidWith(noChanges))
})

user('should know that data is invalid when comes with an empty authid', () => {
    assert.not.ok(isUserValidWith({authId: ''}))
})

user('should know that data is invalid when comes with an empty name', () => {
    assert.not.ok(isUserValidWith({name: ''}))
})

user('should know that data is invalid when comes with an empty username', () => {
    assert.not.ok(isUserValidWith({username: ''}))
})

user('should know that data is invalid when comes with an invalid email', () => {
    assert.not.ok(isUserValidWith({email: 'notValid@.com'}))
})

user('should know that data is invalid when comes with an out of range status', () => {
    assert.not.ok(isUserValidWith({status: UserStatus.count()}))
})

user('should know that data is invalid when comes with a lastLogin after lastConnection', () => {
    const dto = UserMother.dto()
    assert.not.ok(isUserValidWith({lastLogin: makeAfter(dto.lastConnection, 1)}))
})

user('should know that data is invalid when comes with a lastConnection placed in the future', () => {
    assert.not.ok(isUserValidWith({lastConnection: makeAfter(new Date(), 1)}))
})

user('should know that data is invalid when comes with a signedIn after lastLogin', () => {
    const dto = UserMother.dto()
    assert.not.ok(isUserValidWith({signedIn: makeAfter(dto.lastLogin, 1)}))
})

user.run()

/**
 * @param {Date|string} date 
 * @param {number} seconds 
 * @returns {string}
 */
function makeAfter(date, seconds) {
    precondition(date instanceof Date || EverDate.isISOString(date))
    date = new Date(date)   
    return new Date(date.getTime() + seconds * 1000).toISOString()
}

/**
 * @param {object} obj 
 * @returns {Boolean}
 */
function isUserValidWith(obj) {
    precondition(typeof obj === 'object')
    const dto = {...UserMother.dto(), ...obj}
    return User.isValid(
        dto.authId, dto.name, dto.username, dto.email, dto.status, 
        dto.lastLogin, dto.lastConnection, dto.signedIn, dto.dayStartTime)
}
