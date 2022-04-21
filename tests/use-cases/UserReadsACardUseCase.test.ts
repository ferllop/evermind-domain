import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserReadsACardUseCase} from '../../src/use-cases/UserReadsACardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredUserWithPermissions,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'

const userReadsACardUseCase = suite('User reads a card use case')

userReadsACardUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userReadsACardUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            requesterId: 'anyRequester',
            cardId: '',
        }
        const result = await new UserReadsACardUseCase().execute(invalidRequest)
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userReadsACardUseCase(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        await givenAStoredCard()
        const request = {
            requesterId: 'anyRequester',
            cardId: 'nonExistingId',
        }
        const result = await new UserReadsACardUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userReadsACardUseCase(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        const request = {
            requesterId: 'anyRequester',
            cardId: 'nonExistingId',
        }
        const result = await new UserReadsACardUseCase().execute(request)
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userReadsACardUseCase(
    'given an existing card, ' +
    'when another user with permissions tries to get it ' +
    'should get an object with null as error and card as data', async () => {
        const user = await givenAStoredUserWithPermissions(['GET_PRIVATE_CARD_FROM_OTHER'])
        const card = await givenAStoredCard()
        const request = {
            requesterId: user.id,
            cardId: card.id
        }
        const result = await new UserReadsACardUseCase().execute(request)
        assert.equal(result, Response.OkWithData(card))
    })

userReadsACardUseCase(
    'given an existing card, ' +
    'when its author without permissions tries to get its data' +
    'should obtain an object with null as error and card as data', async () => {
        const user = await givenAStoredUserWithPermissions([])
        const card = await givenAStoredCardFromUser(user)
        const request = {
            requesterId: user.id,
            cardId: card.id
        }
        const result = await new UserReadsACardUseCase().execute(request)
        assert.equal(result, Response.OkWithData(card))
    })

userReadsACardUseCase.run()
