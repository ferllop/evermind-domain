import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserRemovesAccountUseCase} from '../../src/use-cases/UserRemovesAccountUseCase.js'
import {
    givenACleanInMemoryDatabase, givenAStoredUser,
    givenAStoredUserWithPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertUserIsNotStored,
    assertUserIsStored,
} from '../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserIdentification} from '../../src/domain/user/UserIdentification.js'

const userRemovesAccountUseCase = suite('User removes account use case')

userRemovesAccountUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userRemovesAccountUseCase(
    'given an existing user with permissions, ' +
    'when removing its own account ' +
    'should remove it and return an object with either ' +
    'data and error properties as null', async () => {
        const user = await givenAStoredUserWithPermissions(['REMOVE_OWN_ACCOUNT'])
        await assertUserIsStored(user)
        const validRequest = {
            requesterId: user.id,
            userId: user.id
        }
        const result = await new UserRemovesAccountUseCase().execute(validRequest)
        await assertUserIsNotStored(user)
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase(
    'given an existing user without permissions to remove its own account, ' +
    'when executing the use case properly ' +
    'should return an object with UserIsNotAuthorizedError REMOVE_OWN_ACCOUNT', async () => {
        const user = await givenAStoredUserWithPermissions([])
        const request = {
            requesterId: user.id,
            userId: user.id
        }
        const result = await new UserRemovesAccountUseCase().execute(request)
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['REMOVE_OWN_ACCOUNT'])))
    })

userRemovesAccountUseCase(
    'given an existing user with permissions, ' +
    'when removing an account from other user ' +
    'should remove it and return an object with either ' +
    'data and error properties as null', async () => {
        const requester = await givenAStoredUserWithPermissions(['REMOVE_ACCOUNT_FROM_OTHER'])
        const userToRemove = await givenAStoredUser()
        await assertUserIsStored(userToRemove)
        const request = {
            requesterId: requester.id,
            userId: userToRemove.id
        }
        const result = await new UserRemovesAccountUseCase().execute(request)
        await assertUserIsNotStored(userToRemove)
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesAccountUseCase(
    'given an existing user without permissions to remove an account from other, ' +
    'when tries to remove an account from other user ' +
    'should return an object with UserIsNotAuthorizedError REMOVE_ACCOUNT_FROM_OTHER', async () => {
        const requester = await givenAStoredUserWithPermissions([])
        const userToRemove = await givenAStoredUser()
        const request = {
            requesterId: requester.id,
            userId: userToRemove.id
        }
        const result = await new UserRemovesAccountUseCase().execute(request)
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['REMOVE_ACCOUNT_FROM_OTHER'])))
    })

userRemovesAccountUseCase(
    'given an non-existing user id into an existing users table, ' +
    'when an existing user with permissions tries to delete a non existing user account ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['REMOVE_ACCOUNT_FROM_OTHER'])
        const request = {
            requesterId: requester.id,
            userId: UserIdentification.create().getId(),
        }
        const result = await new UserRemovesAccountUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userRemovesAccountUseCase(
    'given an non-existing table, ' +
    'it should return an object with data property as null and ' +
    'error property as USER_NOT_FOUND DomainError', async () => {
        const request = {
            requesterId: UserIdentification.create().getId(),
            userId: UserIdentification.create().getId(),
        }
        const result = await new UserRemovesAccountUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

userRemovesAccountUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['REMOVE_ACCOUNT_FROM_OTHER'])
        const invalidRequest = {
            requesterId: requester.id,
            userId: '',
        }
        const result = await new UserRemovesAccountUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userRemovesAccountUseCase.run()
