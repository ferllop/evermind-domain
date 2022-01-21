import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserGetsUserInfoUseCase} from '../../src/use-cases/UserGetsUserInfoUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'

const userGetsUserInfoUseCase = suite('User gets user info use case')

userGetsUserInfoUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userGetsUserInfoUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            id: ''
        }
        const result = await new UserGetsUserInfoUseCase().execute(invalidRequest)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userGetsUserInfoUseCase(
    'given a non existing id in an existing users table, ' +
    'should return an object with data property as null ' +
    'and USER_NOT_FOUND DomainError', async () => {
        const result = await new UserGetsUserInfoUseCase().execute({id: 'nonExistingId'})
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given a non existing users table, ' +
    'should return an object with data property as null ' +
    'and USER_NOT_FOUND DomainError', async () => {
        const result = await new UserGetsUserInfoUseCase().execute({id: 'nonExistingId'})
        assert.equal(result, Response.withError(ErrorType.USER_NOT_FOUND))
    })

userGetsUserInfoUseCase(
    'given an existing id, ' +
    'should return an object with null as error and user as data', async () => {
        const user = await givenAStoredUser()
        const result = await new UserGetsUserInfoUseCase().execute({id: user.id})
        assert.equal(result, Response.OkWithData(user))
    })

userGetsUserInfoUseCase.run()
