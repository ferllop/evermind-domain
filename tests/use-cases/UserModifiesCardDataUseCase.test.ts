import {CardDto} from '../../src/domain/card/CardDto.js'
import {CardField} from '../../src/implementations/persistence/in-memory/CardField.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserModifiesCardDataUseCase} from '../../src/use-cases/UserModifiesCardDataUseCase.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCard,
    givenAStoredCardFromUser,
    givenAStoredUserWithPermissions,
    withAnyRequester,
} from '../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {CardBuilder} from '../domain/card/CardBuilder.js'
import {InputDataNotValidError} from '../../src/domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../../src/domain/errors/CardNotFoundError.js'
import {UserIsNotAuthorizedError} from '../../src/domain/errors/UserIsNotAuthorizedError.js'
import {RequesterIdentification} from '../../src/domain/authorization/permission/RequesterIdentification.js'

const userModifiesCardDataUseCase = suite('User modifies card data use case')

userModifiesCardDataUseCase.before.each(async () => await givenACleanInMemoryDatabase())

userModifiesCardDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserModifiesCardDataUseCase().execute(withAnyRequester({
            ...new CardBuilder().buildDto(),
        }))
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', async () => {
        const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
        const card = await givenAStoredCardFromUser(user)
        const result = await new UserModifiesCardDataUseCase().execute({
            ...card,
            question: 'newQuestion',
            requesterId: card.authorId,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>('cards', card.id)
        assert.equal(result, Response.OkWithoutData())
        assert.equal(storedCard!.question, 'newQuestion')
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when provided a different labelling, the card should be updated in storage', async () => {
        const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
        const card = await givenAStoredCardFromUser(user)
        const newLabelling = ['new-labelling']
        await new UserModifiesCardDataUseCase().execute({
            ...card,
            labelling: newLabelling,
            requesterId: card.authorId,
        })
        const storedCard = await new InMemoryDatastore().read<CardDto>(CardField.TABLE_NAME, card.id)
        assert.equal(storedCard!.labelling, newLabelling)
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', async () => {
        const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
        const card = await givenAStoredCardFromUser(user)
        const result = await new UserModifiesCardDataUseCase().execute(
            {
                ...card,
                question: 'updatedQuestion',
                requesterId: card.authorId,
            })
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesCardDataUseCase(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError as error', async () => {
        const card = await givenAStoredCard()
        const result = await new UserModifiesCardDataUseCase().execute(withAnyRequester({
            ...card,
            id: 'notExistingId',
        }))
        assert.equal(result, Response.withDomainError(new CardNotFoundError()))
    })

userModifiesCardDataUseCase(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const card = await givenAStoredCard()
        const invalidCardData = {
            ...card,
            question: '',
        }
        const result = await new UserModifiesCardDataUseCase().execute(withAnyRequester({
            ...invalidCardData,
        }))
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesCardDataUseCase(
    'given wrong labelling in card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const card = await givenAStoredCard()
        const invalidLabelling = ['']
        const result = await new UserModifiesCardDataUseCase().execute(withAnyRequester({
            ...card,
            labelling: invalidLabelling,
        }))
        assert.equal(result, Response.withDomainError(new InputDataNotValidError()))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when a user without UPDATE_OWN_CARD permission tries to update its own card' +
    'should return an object with UserIsNotAuthorizedError UPDATE_OWN_CARD as error property and ' +
    'null as data property', async () => {
        const card = await givenAStoredCard()
        const result = await new UserModifiesCardDataUseCase().execute(
            {
                ...card,
                requesterId: card.authorId,
            })
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['UPDATE_OWN_CARD'])))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when a user without UPDATE_CARD_FROM_OTHER permission tries to update a card from other user' +
    'should return an object with UserIsNotAuthorizedError UPDATE_CARD_FROM_OTHER as error property and ' +
    'null as data property', async () => {
        const card = await givenAStoredCard()
        const result = await new UserModifiesCardDataUseCase().execute(
            {
                ...card,
                requesterId: RequesterIdentification.create().getId(),
            })
        assert.equal(
            result,
            Response.withDomainError(
                new UserIsNotAuthorizedError(['UPDATE_CARD_FROM_OTHER'])))
    })

userModifiesCardDataUseCase.run()
