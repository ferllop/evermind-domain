import { CreateUserUseCase } from '../../src/use-cases/CreateUser.js'
import { UserMother } from '../models/user/UserMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'

const createUser = suite("CreateUser UseCase")

/**@type {Datastore} */
let datastore
createUser.before.each(() => {
    datastore = new InMemoryDatastore()
})

createUser(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = new CreateUserUseCase().execute(UserMother.dto(), new InMemoryDatastore())
        assert.ok(ResultMother.isEmptyOk(result))
    })

createUser(
    'given data representing a user, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        new CreateUserUseCase().execute(UserMother.dto(), datastore)
        assert.ok(new DatastoreMother(UserMother, datastore).isDataStored('authId'))
    })

createUser(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new CreateUserUseCase().execute(UserMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

createUser.run()
