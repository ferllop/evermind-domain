import { NullUser } from '../../../src/models/user/NullUser.js'
import { assert, suite } from '../../test-config.js'
import { ImplementationsContainer } from '../../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../../src/implementations/implementations-container/Dependency.js'
import { AsyncUserRepository } from '../../../src/models/user/AsyncUserRepository.js'
import { AsyncInMemoryDatastore } from '../../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'

const userRepository = suite('User Repository')


userRepository('should know how to provide a null user', () => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
    const sut = new AsyncUserRepository()
    assert.equal(sut.getNull(), NullUser.getInstance())
})

userRepository.run()
