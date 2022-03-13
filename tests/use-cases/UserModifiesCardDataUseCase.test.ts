import {CardDto} from '../../src/domain/card/CardDto.js'
import {CardField} from '../../src/implementations/persistence/in-memory/CardField.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserModifiesCardDataUseCase} from '../../src/use-cases/UserModifiesCardDataUseCase.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'

const userModifiesCardDataUseCase = suite('User modifies card data use case')

userModifiesCardDataUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userModifiesCardDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserModifiesCardDataUseCase().execute({
            userId: '',
            ...new CardBuilder().buildDto(),
        })
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', async () => {
        const card = await givenAStoredCard()
        const newAuthorId = 'newAuthorId'
        await new UserModifiesCardDataUseCase().execute({
            userId: 'notRelevant',
            ...card,
            authorId: newAuthorId,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>('cards', card.id)
        assert.equal(storedCard!.authorId, newAuthorId)
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when provided a different labelling, the card should be updated in storage', async () => {
        const card = await givenAStoredCard()
        const newLabelling = ['new-labelling']
        await new UserModifiesCardDataUseCase().execute({
            userId: 'notRelevant',
            ...card,
            labelling: newLabelling,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>(CardField.TABLE_NAME, card.id)
        assert.equal(storedCard!.labelling, newLabelling)
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', async () => {
        const card = await givenAStoredCard()
        const result = await new UserModifiesCardDataUseCase().execute(
            {
                userId: 'notRelevant',
                ...card,
                authorId: 'updatedAuthor'
            })
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesCardDataUseCase(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError as error', async () => {
        const card = await givenAStoredCard()
        const result = await new UserModifiesCardDataUseCase().execute({
            userId: 'notRelevant',
            ...card,
            id: 'notExistingId',
        })
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userModifiesCardDataUseCase(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidCardData = {
            ...new CardBuilder().buildDto(),
            id: ''
        }
        const result = await new UserModifiesCardDataUseCase().execute({
            userId: '',
            ...invalidCardData
        })
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesCardDataUseCase(
    'given wrong labelling in card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const invalidLabelling = ['']
        const result = await new UserModifiesCardDataUseCase().execute({
            userId: '',
            ...new CardBuilder().buildDto(),
            labelling: invalidLabelling,
        })
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesCardDataUseCase.run()
