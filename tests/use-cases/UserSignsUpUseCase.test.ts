import { UserMother } from '../domain/user/UserMother.js'
import { assert, suite } from '../test-config.js'
import { Response } from '../../src/use-cases/Response.js'
import { ErrorType } from '../../src/domain/errors/ErrorType.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { DatastoreTestClass } from '../domain/DatastoreTestClass.js'
import { DatastoreMother } from '../domain/DatastoreMother.js'
import { UserSignsUpUseCase } from '../../src/use-cases/UserSignsUpUseCase.js'

const userSignsUpUseCase = suite("User signs up use case")

userSignsUpUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
})

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const result = await new UserSignsUpUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.OkWithoutData())
    })

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        ImplementationsContainer.set(Dependency.DATASTORE, new DatastoreTestClass())
        const datastore = ImplementationsContainer.get(Dependency.DATASTORE) as DatastoreTestClass
        await new UserSignsUpUseCase().execute(new UserMother().dto())
        assert.ok((await new DatastoreMother(new UserMother(), datastore)).isDataStored(datastore.dtoId, 'authId'))
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserSignsUpUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userSignsUpUseCase.run()
