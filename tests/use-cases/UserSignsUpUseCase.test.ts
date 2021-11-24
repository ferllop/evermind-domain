import { UserSignsUpUseCase } from '../../src/use-cases/UserSignsUpUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { assert, suite } from '../test-config.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { Response } from '../../src/use-cases/Response.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { DatastoreTestClass } from '../models/DatastoreTestClass.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/NewInMemoryDatastore.js'

const userSignsUpUseCase = suite("User signs up use case")

userSignsUpUseCase.before.each(() => {
    ImplementationsContainer.set(Dependency.DATASTORE, new InMemoryDatastore())
})

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = new UserSignsUpUseCase().execute(new UserMother().dto())
        assert.equal(result, Response.OkWithoutData())
    })

userSignsUpUseCase(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        ImplementationsContainer.set(Dependency.DATASTORE, new DatastoreTestClass())
        const datastore = ImplementationsContainer.get(Dependency.DATASTORE) as DatastoreTestClass
        new UserSignsUpUseCase().execute(new UserMother().dto())
        assert.ok(new DatastoreMother(new UserMother(), datastore).isDataStored(datastore.dtoId, 'authId'))
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserSignsUpUseCase().execute(new UserMother().invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userSignsUpUseCase.run()
