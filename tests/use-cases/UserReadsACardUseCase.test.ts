import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {assert, suite} from '../test-config.js'
import {UserReadsACardUseCase} from '../../src/use-cases/UserReadsACardUseCase.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'

const userReadsACardUseCase = suite("User reads a card use case")

userReadsACardUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userReadsACardUseCase(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidRequest = {
            id: ''
        }
        const result = await new UserReadsACardUseCase().execute(invalidRequest)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userReadsACardUseCase(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        await givenAStoredCard()
        const result = await new UserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserReadsACardUseCase().execute({ id: 'nonExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userReadsACardUseCase(
    'given an existing id, ' +
    'should return an object with null as error and card as data', async () => {
        const card = await givenAStoredCard()
        const result = await new UserReadsACardUseCase().execute({id: card.id})
        assert.equal(result, Response.OkWithData(card))
    })

userReadsACardUseCase.run()
