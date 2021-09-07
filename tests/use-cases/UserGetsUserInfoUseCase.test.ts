import { ErrorType } from '../../src/errors/ErrorType.js'
import { Response } from '../../src/models/value/Response.js'
import { Datastore } from '../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UserGetsUserInfoUseCase } from '../../src/use-cases/UserGetsUserInfoUseCase.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userGetsUserInfoUseCase = suite("User gets user info use case")

let datastore: Datastore
userGetsUserInfoUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})

userGetsUserInfoUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserGetsUserInfoUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userGetsUserInfoUseCase(
    'given a non existing id in an existing users table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UserGetsUserInfoUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.equal(result, Response.withError(ErrorType.RESOURCE_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given a non existing users table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserGetsUserInfoUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.equal(result, Response.withError(ErrorType.RESOURCE_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given an existing id, ' +
    'should return an object with null as error and user as data', () => {
        new DatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = new UserGetsUserInfoUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.ok(ResultMother.isOkWithDataStrings(result, new UserMother().numberedDto(1), 'authId'))
    })

userGetsUserInfoUseCase.run()
