import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UserModifiesUserDataUseCase } from '../../src/use-cases/UserModifiesUserDataUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userModifiesUserDataUseCase = suite("User modifies user data use case")

let datastore: Datastore
userModifiesUserDataUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})

userModifiesUserDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserModifiesUserDataUseCase().execute(new UserMother().dto(), datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'the user should be updated in storage', () => {
        const dsMother = new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const newName = 'newName'
        new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), name: newName }, datastore)
        assert.ok(dsMother.stored(1).hasPropertyValue('name', newName))
    })

userModifiesUserDataUseCase(
    'given a previously stored user and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), name: 'newName' }, datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

userModifiesUserDataUseCase(
    'given an unexisting user in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UserModifiesUserDataUseCase().execute({ ...new UserMother().numberedDto(1), id: 'notExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userModifiesUserDataUseCase(
    'given wrong user data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserModifiesUserDataUseCase().execute(new UserMother().invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

userModifiesUserDataUseCase.run()
