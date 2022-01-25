import {precondition} from '../../../src/implementations/preconditions.js'
import {assert, suite} from '../../test-config.js'
import {UserFactory} from '../../../src/domain/user/UserFactory.js'
import {UserBuilder} from './UserBuilder.js'

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
    const dto = {...new UserBuilder().buildDto(), ...obj}
    return new UserFactory().isValid(dto.name, dto.username, dto.dayStartTime, undefined)
}
