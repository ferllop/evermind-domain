import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredUser,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {UserSubscribesToCardUseCase} from '../../src/index.js'
import {UserGetsUserSubscriptionsUseCase} from '../../src/use-cases/UserGetsUserSubscriptionsUseCase.js'
import {UserNotFoundError} from '../../src/domain/errors/UserNotFoundError.js'

const useCase = suite("User gets user subscription use case")

useCase.before.each(async () => await givenACleanInMemoryDatabase())

useCase(
    'given an existing user getting the two existing subscriptions of a user, ' +
    'should return an object with the subscriptions array as data and no error as error', async () => {
        const {id: userId} = await givenAStoredUser()
        const card1 = await givenAStoredCard()
        const card2 = await givenAStoredCard()
        const subscription1 = await new UserSubscribesToCardUseCase().execute({userId, cardId: card1.id})
        const subscription2 = await new UserSubscribesToCardUseCase().execute({userId, cardId: card2.id})
        const result = await new UserGetsUserSubscriptionsUseCase().execute({userId})
        assert.equal(result, Response.OkWithData([subscription1.data, subscription2.data]))
    })

useCase(
    'given an existing user getting the non existing subscriptions of a user, ' +
    'should return an object with an empty array as data and no error as error', async () => {
        const {id: userId} = await givenAStoredUser()
        const result = await new UserGetsUserSubscriptionsUseCase().execute({userId})
        assert.equal(result, Response.OkWithData([]))
    })

useCase(
    'given a non existing id in an existing user table, ' +
    'should return an object with data property as null ' +
    'and UserNotFound DomainError', async () => {
        await givenAStoredUser()
        const result = await new UserGetsUserSubscriptionsUseCase().execute({ userId: 'nonExistingId' })
        assert.equal(result, Response.withDomainError(new UserNotFoundError()))
    })

useCase(
    'given a user getting the subscriptions of a an invalid user id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            userId: ''
        }
        const result = await new UserGetsUserSubscriptionsUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

useCase.run()
