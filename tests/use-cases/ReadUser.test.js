import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { ReadUserUseCase } from '../../src/use-cases/ReadUser.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const readUser = suite("ReadUser UseCase")

/**@type {Datastore} */
let datastore
readUser.before.each(() => {
    datastore = new InMemoryDatastore()
})

readUser(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new ReadUserUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

readUser(
    'given a non existing id in an existing users table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(UserMother, datastore).having(1).storedIn()
        const result = new ReadUserUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readUser(
    'given a non existing users table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        const result = new ReadUserUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readUser(
    'given an existing id, ' +
    'should return an object with null as error and user as data', () => {
        new DatastoreMother(UserMother, datastore).having(1).storedIn()
        const result = new ReadUserUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.ok(ResultMother.isOkWithDataStrings(result, UserMother.numberedDto(1), ['authId']))
    })

readUser.run()
