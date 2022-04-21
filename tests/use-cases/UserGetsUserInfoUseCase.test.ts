import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserGetsUserInfoUseCase} from '../../src/use-cases/UserGetsUserInfoUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'

const userGetsUserInfoUseCase = suite('User gets user info use case')

userGetsUserInfoUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userGetsUserInfoUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const requester = await givenAStoredUser()
        const invalidRequest = {
            requesterId: requester.id,
            userId: '',
        }
        const result = await new UserGetsUserInfoUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userGetsUserInfoUseCase(
    'given a non existing id in an existing users table, ' +
    'should return an object with data property as null ' +
    'and USER_NOT_FOUND DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['GET_DATA_FROM_OTHER_USER'])
        const request = {
            requesterId: requester.id,
            userId: 'nonExistingId',
        }
        const result = await new UserGetsUserInfoUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userGetsUserInfoUseCase(
    'given a non existing users table, ' +
    'should return an object with data property as null ' +
    'and UserIsNotAuthorizedError GET_DATA_FROM_OTHER_USERS DomainError', async () => {
        const request = {
            requesterId: 'nonexistent',
            userId: 'nonExistingId',
        }
        const result = await new UserGetsUserInfoUseCase().execute(request)
        assert.equal(
            result,
            Response.withDomainError(new UserIsNotAuthorizedError(['GET_DATA_FROM_OTHER_USER'])))
    })

userGetsUserInfoUseCase(
    'given an existing id, ' +
    'should return an object with null as error and user as data', async () => {
        const requester = await givenAStoredUserWithPermissions(['GET_DATA_FROM_OTHER_USER'])
        const user = await givenAStoredUser()
        const request = {
            requesterId: requester.id,
            userId: user.id,
        }
        const result = await new UserGetsUserInfoUseCase().execute(request)
        assert.equal(result, Response.OkWithData(user))
    })

userGetsUserInfoUseCase.run()
