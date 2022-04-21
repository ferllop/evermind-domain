import {assert, suite} from '../test-config.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserSignsUpUseCase} from '../../src/use-cases/UserSignsUpUseCase.js'
import {Username} from '../../src/domain/user/Username.js'
import {PersistenceFactory} from '../../src/implementations/persistence/PersistenceFactory.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredUserWithPermissions,
    givenTheStoredUser, givenTheStoredUserPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {UserBuilder} from '../domain/user/UserBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {UserAlreadyExistsError} from '../../src/domain/errors/UserAlreadyExistsError.js'
import {NullStoredUser} from '../../src/domain/user/NullStoredUser.js'

const userSignsUpUseCase = suite('User signs up use case')

userSignsUpUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userSignsUpUseCase(
    'given an anonymous user, ' +
    'when provides data to create a user, ' +
    'an object should be returned with null error and the identified user as data', async () => {
        const {id: _, ...user} = new UserBuilder().buildDto()
        const result = await new UserSignsUpUseCase().execute(user)
        const createdUser = {
            id: result.data!.id,
            ...user,
        }
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))
        assert.equal(storedUser.toDto(), createdUser)
        assert.equal(result, Response.OkWithData(createdUser))
    })

userSignsUpUseCase(
    'given a user with permissions, ' +
    'when provides data to create another user, ' +
    'an object should be returned with null error and the identified user as data', async () => {
        const requester = await givenAStoredUserWithPermissions(['CREATE_ACCOUNT_FOR_OTHER'])
        const {id: _, ...user} = new UserBuilder().setUsername('new-username').buildDto()
        const request = {
            requesterId: requester.id,
            ...user,
        }
        const result = await new UserSignsUpUseCase().execute(request)
        const createdUser = {
            id: result.data!.id,
            ...user,
        }
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))
        assert.equal(storedUser.toDto(), createdUser)
        assert.equal(result, Response.OkWithData(createdUser))
    })

userSignsUpUseCase(
    'given a user without permissions, ' +
    'when provides data to create another user, ' +
    'an object should be returned with null data ' +
    'and UserIsNotAuthorizedError CREATE_ACCOUNT_FOR_OTHER ' +
    'and the user is not created', async () => {
        const requester = await givenAStoredUserWithPermissions([])
        const {id, ...user} = new UserBuilder().setUsername('the-new-username').buildDto()
        const request = {
            requesterId: requester.id,
            ...user,
        }
        const result = await new UserSignsUpUseCase().execute(request)
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))
        assert.equal(storedUser, NullStoredUser.getInstance())
        assert.equal(result, Response.withDomainError(
            new UserIsNotAuthorizedError(['CREATE_ACCOUNT_FOR_OTHER'])
        ))
    })

userSignsUpUseCase(
    'given a user with permissions, ' +
    'when provides data to create another user with an existing username, ' +
    'an object should be returned with null data and UserAlreadyExistsError error ' +
    'and the user is not created', async () => {
        const requester = new UserBuilder().setName('Requester').buildDto()
        await givenTheStoredUser(requester)
        await givenTheStoredUserPermissions(requester, 'CREATE_ACCOUNT_FOR_OTHER')
        const {id, ...user} = new UserBuilder().setUsername(requester.username).buildDto()
        const request = {
            requesterId: requester.id,
            ...user,
        }
        const result = await new UserSignsUpUseCase().execute(request)
        const storedUser = await PersistenceFactory.getUserDao().findByUsername(new Username(user.username))
        assert.equal(result, Response.withDomainError(new UserAlreadyExistsError()))
        assert.equal(storedUser.toDto(), requester)
    })

userSignsUpUseCase(
    'given wrong user data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidUsername = ''
        const invalidRequest = {
            ...new UserBuilder().buildDto(),
            username: invalidUsername,
        }
        const result = await new UserSignsUpUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userSignsUpUseCase.run()
