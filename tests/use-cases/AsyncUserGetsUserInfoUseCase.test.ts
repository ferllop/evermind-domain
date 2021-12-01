import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { UserMother } from '../models/user/UserMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { assert, suite } from '../test-config.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'
import {AsyncInMemoryDatastore} from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import {AsyncUserGetsUserInfoUseCase} from '../../src/use-cases/AsyncUserGetsUserInfoUseCase.js'
import {AsyncDatastoreMother} from '../models/AsyncDatastoreMother.js'
import {AsyncDatastore} from '../../src/models/AsyncDatastore.js'

const userGetsUserInfoUseCase = suite("User gets user info use case")

let datastore: AsyncDatastore
userGetsUserInfoUseCase.before.each(() => {
    datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastore
})

userGetsUserInfoUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new AsyncUserGetsUserInfoUseCase().execute(IdentificationMother.invalidDto())
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userGetsUserInfoUseCase(
    'given a non existing id in an existing users table, ' +
    'should return an object with data property as null ' +
    'and USER_NOT_FOUND DomainError', async () => {
        await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = await new AsyncUserGetsUserInfoUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given a non existing users table, ' +
    'should return an object with data property as null ' +
    'and USER_NOT_FOUND DomainError', async () => {
        const result = await new AsyncUserGetsUserInfoUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given an existing id, ' +
    'should return an object with null as error and user as data', async () => {
        await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
        const result = await new AsyncUserGetsUserInfoUseCase().execute(IdentificationMother.numberedDto(1))
        assert.equal(result, Response.OkWithData(new UserMother().numberedDto(1)))
    })

userGetsUserInfoUseCase.run()
