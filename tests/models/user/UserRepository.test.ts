import { NullUser } from '../../../src/models/user/NullUser.js'
import { UserRepository } from '../../../src/models/user/UserRepository.js'
import { InMemoryDatastore } from '../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'
import { ImplementationsContainer } from '../../../src/implementations/ImplementationsContainer.js'

const userRepository = suite('User Repository')


userRepository('should know how to provide a null user', () => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    const sut = new UserRepository()
    assert.equal(sut.getNull(), NullUser.getInstance())
})

userRepository.run()
