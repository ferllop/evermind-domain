import { UserSignUpUseCase } from '../../src/use-cases/UserSignUpUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { DatastoreTestClass } from '../storage/datastores/DatastoreTestClass.js'

const createUser = suite("CreateUser UseCase")

let datastore: Datastore
createUser.before.each(() => {
    datastore = new InMemoryDatastore()
})

createUser(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = new UserSignUpUseCase().execute(new UserMother().dto(), new InMemoryDatastore())
        assert.ok(ResultMother.isEmptyOk(result))
    })

createUser(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        const datastore = new DatastoreTestClass()
        new UserSignUpUseCase().execute(new UserMother().dto(), datastore)
        assert.ok(new DatastoreMother(new UserMother(), datastore).isDataStored(datastore.dtoId, 'authId'))
    })

createUser(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserSignUpUseCase().execute(new UserMother().invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

createUser.run()
