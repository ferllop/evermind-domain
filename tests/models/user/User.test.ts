import { precondition } from '../../../src/implementations/preconditions.js'
import { User } from '../../../src/models/user/User.js'
import { assert, suite } from '../../test-config.js'
import { UserMother } from './UserMother.js'

const user = suite('User')

user('should know that valid data is valid', () => {
    const noChanges = {}
    assert.ok(isUserValidWith(noChanges))
})

user('should know that data is invalid when comes with an empty name', () => {
    assert.not.ok(isUserValidWith({name: ''}))
})

user('should know that data is invalid when comes with an empty username', () => {
    assert.not.ok(isUserValidWith({username: ''}))
})

user.run()

function isUserValidWith(obj: object) {
    precondition(typeof obj === 'object')
    const dto = {...new UserMother().dto(), ...obj}
    return User.isValid(
        dto.name, dto.username, dto.dayStartTime)
}
