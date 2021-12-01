import { NullUser } from '../../../src/models/user/NullUser.js'
import { assert, suite } from '../../test-config.js'
import { ImplementationsContainer } from '../../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { AsyncUserRepository } from '../../../src/models/user/AsyncUserRepository.js'

const userRepository = suite('User Repository')


userRepository('should know how to provide a null user', () => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
    const sut = new AsyncUserRepository()
    assert.equal(sut.getNull(), NullUser.getInstance())
})

userRepository.run()
