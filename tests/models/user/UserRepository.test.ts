import { NullUser } from '../../../src/models/user/NullUser.js'
import { UserRepository } from '../../../src/models/user/UserRepository.js'
import { InMemoryDatastore } from '../../../src/storage/datastores/InMemoryDatastore.js'
import { assert, suite } from '../../test-config.js'

const userRepository = suite('User Repository')

userRepository('should know how to provide a null user', () => {
    const sut = new UserRepository(new InMemoryDatastore())
    assert.equal(sut.getNull(), NullUser.getInstance())
})

userRepository.run()
