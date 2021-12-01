import { UserMother } from '../models/user/UserMother.js'
import { assert, suite } from '../test-config.js'
import { Response } from '../../src/use-cases/Response.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { AsyncInMemoryDatastore } from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import { AsyncDatastoreTestClass } from '../models/AsyncDatastoreTestClass.js'
import { AsyncDatastoreMother } from '../models/AsyncDatastoreMother.js'
import { AsyncUserSignsUpUseCase } from '../../src/use-cases/AsyncUserSignsUpUseCase.js'

const userSignsUpUseCase = suite("User signs up use case")

userSignsUpUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
})

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const result = await new AsyncUserSignsUpUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.OkWithoutData())
    })

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncDatastoreTestClass())
        const datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastoreTestClass
        await new AsyncUserSignsUpUseCase().execute(new UserMother().dto())
        assert.ok((await new AsyncDatastoreMother(new UserMother(), datastore)).isDataStored(datastore.dtoId, 'authId'))
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new AsyncUserSignsUpUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userSignsUpUseCase.run()
