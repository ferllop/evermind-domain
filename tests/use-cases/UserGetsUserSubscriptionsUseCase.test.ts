import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
    givenASubscription,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserGetsUserSubscriptionsUseCase} from '../../src/use-cases/UserGetsUserSubscriptionsUseCase.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'

const useCase = suite("User gets user subscription use case")

useCase.before.each(async () => await givenACleanInMemoryDatabase())

useCase(
    'given an existing user with permissions ' +
    'when reading its own two existing subscriptions, ' +
    'should return an object with the subscriptions array as data and no error as error', async () => {
        const requester = await givenAStoredUserWithPermissions(['READ_OWN_SUBSCRIPTIONS'])
        const card1 = await givenAStoredCard()
        const card2 = await givenAStoredCard()
        const subscription1 = await givenASubscription(requester, card1)
        const subscription2 = await givenASubscription(requester, card2)

        const request = {
            requesterId: requester.id,
            userId: requester.id,
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(request)
        assert.equal(result, Response.OkWithData([subscription1, subscription2]))
    })

useCase(
    'given an existing user with permissions ' +
    'when reading the two existing subscriptions of another user, ' +
    'should return an object with the subscriptions array as data and no error as error', async () => {
        const requester = await givenAStoredUserWithPermissions(['READ_SUBSCRIPTIONS_FROM_ANOTHER'])
        const user = await givenAStoredUser()
        const card1 = await givenAStoredCard()
        const card2 = await givenAStoredCard()
        const subscription1 = await givenASubscription(user, card1)
        const subscription2 = await givenASubscription(user, card2)

        const request = {
            requesterId: requester.id,
            userId: user.id,
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(request)
        assert.equal(result, Response.OkWithData([subscription1, subscription2]))
    })

useCase(
    'given an existing user getting the non existing subscriptions of a user, ' +
    'should return an object with an empty array as data and no error as error', async () => {
        const requester = await givenAStoredUserWithPermissions(['READ_OWN_SUBSCRIPTIONS'])
        const request = {
            requesterId: requester.id,
            userId: requester.id,
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(request)
        assert.equal(result, Response.OkWithData([]))
    })

useCase(
    'when reading th subscip a non existing id in an existing user table, ' +
    'should return an object with data property as null ' +
    'and UserNotFound DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['READ_SUBSCRIPTIONS_FROM_ANOTHER'])
        const request = {
            requesterId: requester.id,
            userId: 'nonExistingId',
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

useCase(
    'given a user getting the subscriptions of a an invalid user id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const requester = await givenAStoredUserWithPermissions(['READ_SUBSCRIPTIONS_FROM_ANOTHER'])
        const invalidRequest = {
            requesterId: requester.id,
            userId: '',
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

useCase.run()
