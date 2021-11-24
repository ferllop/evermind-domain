import { NullUser } from '../../../src/models/user/NullUser.js'
import { UserRepository } from '../../../src/models/user/UserRepository.js'
import { assert, suite } from '../../test-config.js'
import { ImplementationsContainer } from '../../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../../src/implementations/implementations-container/Dependency.js'
import { NewInMemoryDatastore } from '../../../src/implementations/persistence/in-memory/NewInMemoryDatastore.js'

const userRepository = suite('User Repository')


userRepository('should know how to provide a null user', () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new NewInMemoryDatastore())
    const sut = new UserRepository()
    assert.equal(sut.getNull(), NullUser.getInstance())
})

userRepository.run()
