import { DomainError } from '../../../src/errors/DomainError.js'
import { ErrorType } from '../../../src/errors/ErrorType.js'
import { NullUser } from '../../../src/models/user/NullUser.js'
import { UserRepository } from '../../../src/models/user/UserRepository.js'
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'
import { UserMother } from './UserMother.js'

const userRepository = suite('User Repository')

userRepository(
    'given a non existing user' +
    'when executing this use case' +
    'should return a USER_NOT_FOUND error', () => {
        const db = new InMemoryDatastore()
        const user = givenNonExistingUser()
        const response = new UserRepository(db).delete(user)
        assert.equal(response, new DomainError(ErrorType.RESOURCE_NOT_FOUND))
    })
    
    userRepository(
        'given a null user' +
        'when deleting it' +
        'then return a INVALID_INPU_DATA error', () => {
            const user = givenNullUser()
        const response = new UserRepository(new InMemoryDatastore()).delete(user)
        assert.equal(response, new DomainError(ErrorType.INPUT_DATA_NOT_VALID))

    })

userRepository.run()

function givenNullUser() {
    return NullUser.getInstance()
}

function givenNonExistingUser() {
    return new UserMother().standard()
}
