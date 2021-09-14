import { DomainError } from '../../../src/errors/DomainError.js'
import { ErrorType } from '../../../src/errors/ErrorType.js'
import { NullUser } from '../../../src/models/user/NullUser.js'
import { UserRepository } from '../../../src/models/user/UserRepository.js'
import { Identification } from '../../../src/models/value/Identification.js'
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'

const userRepository = suite('User Repository')

userRepository(
    'given a non existing user' +
    'when executing this use case' +
    'should return a USER_NOT_FOUND error', () => {
        const db = new InMemoryDatastore()
        const response = new UserRepository(db).delete(new Identification('non-existing'))
        assert.equal(response, new DomainError(ErrorType.RESOURCE_NOT_FOUND))
    })
    
    userRepository(
        'given a null user' +
        'when deleting it' +
        'then return a INVALID_INPU_DATA error', () => {
            const user = nonExistingUser()
        const response = new UserRepository(new InMemoryDatastore()).delete(user.getId())
        assert.equal(response, new DomainError(ErrorType.INPUT_DATA_NOT_VALID))

    })

userRepository.run()

function nonExistingUser() {
    return NullUser.getInstance()
}
