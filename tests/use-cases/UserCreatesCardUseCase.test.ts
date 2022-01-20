import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {CardMother} from '../domain/card/CardMother.js'
import {IdentificationMother} from '../domain/value/IdentificationMother.js'
import {assert, suite} from '../test-config.js'
import {UserCreatesCardUseCase} from '../../src/use-cases/UserCreatesCardUseCase.js'
import {CardBuilder} from '../domain/card/CardBuilder'
import {AuthorIdentification} from '../../src/domain/card/AuthorIdentification'
import {CardFactory} from '../../src/domain/card/CardFactory'
import {PersistenceFactory} from '../../src/implementations/persistence/PersistenceFactory'
import {givenACleanInMemoryDatabase} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios'

const userCreatesCardUseCase = suite("User creates a card use case")

userCreatesCardUseCase.before( async () => await givenACleanInMemoryDatabase())

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', async () => {
        const result = await new UserCreatesCardUseCase().execute({
            ...new CardMother().dto(),
            userId: IdentificationMother.dto().id
        })
        assert.equal(result, Response.OkWithoutData())
    })

userCreatesCardUseCase(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', async () => {
        const {id, authorID, ...card} = new CardBuilder().buildDto()
        const authorId = AuthorIdentification.create()
        await new UserCreatesCardUseCase().execute({
            ...card,
            userId: authorId.getId(),
        })

        const storedCards = await PersistenceFactory.getCardDao().findByAuthorId(authorId)
        const expectedCard = new CardFactory().fromDto({
            ...card,
            id: storedCards[0].getId().getId(),
            authorID: authorId.getId()
        })
        assert.equal(expectedCard, storedCards[0] )
    })

userCreatesCardUseCase(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidData = {...new CardMother().invalidDto(), userId: ''}
        const result = await new UserCreatesCardUseCase().execute(invalidData)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userCreatesCardUseCase.run()

