import {assert, suite} from '../../../test-config.js'
import {TestableApp} from '../TestableApp.js'
import {CardDto, UserCreatesCardRequest, UserModifiesCardDataRequest} from '../../../../src/index.js'
import {CardRouter} from '../../../../src/delivery/rest-api/routers/CardRouter.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCardFromUser,
    givenAStoredUserWithPermissions,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {assertBodyHasDomainData, assertBodyHasDomainError, assertBodyIsEmpty} from './Router.test.js'
import {givenAnExistingCard} from '../../../implementations/persistence/postgres/card/CardScenario.js'
import {RequiredRequestFieldIsMissingError} from '../../../../src/domain/errors/RequiredRequestFieldIsMissingError.js'
import {
    assertCardIsNotStored,
    assertCardIsStored,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {CardBuilder} from '../../../domain/card/CardBuilder.js'

const cardRouter = suite("Card router")

cardRouter.before.each(async context => {
    await givenACleanInMemoryDatabase()
    context.app = new TestableApp(new CardRouter())
})

cardRouter('given a user with permissions,' +
    'when creating a card ' +
    'should return card and 201 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['CREATE_OWN_CARD'])
    const {id, ...card} = new CardBuilder().withAuthorId(user.id).buildDto()
    const request: UserCreatesCardRequest = {...card, requesterId: user.id}
    const result = await app.post('/cards').send(request)
    const expectedCard: CardDto = {
        id: result.body.domain.data.id,
        ...card
    }
    assertBodyHasDomainData(result.body, expectedCard)
    assert.equal(result.status, 201)
})

cardRouter('given a request with missing requesterId field ' +
    'when creating a card' +
    'should return an RequiredRequestFieldIsMissingError with 400 http response', async ({app}) => {
    const card = await givenAnExistingCard()
    const result = await app.post('/cards').send({...card})
    assertBodyHasDomainError(result.body, new RequiredRequestFieldIsMissingError(['requesterId']))
    assert.equal(result.status, 400)
})

cardRouter('when getting by its id should return card and 200 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions([])
    const card = await givenAStoredCardFromUser(user)
    const result = await app.get('/cards/' + card.id)
    assertBodyHasDomainData(result.body, card)
    assert.equal(result.status, 200)
})

cardRouter('when modifying a card should modify the card return empty and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['UPDATE_OWN_CARD'])
    const card = await givenAStoredCardFromUser(user)
    const modifiedCard: CardDto = {...card, question: 'different question'}
    const request: UserModifiesCardDataRequest = {
        requesterId: user.id,
        ...modifiedCard,
    }
    const result = await app.put('/cards/' + card.id).send(request)
    assertBodyIsEmpty(result.body)
    assert.equal(result.status, 204)
    assertCardIsStored(modifiedCard)
})

cardRouter('when deleting a card should delete the card return empty and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['DELETE_OWN_CARD'])
    const card = await givenAStoredCardFromUser(user)
    const result = await app.delete('/cards/' + card.id).send({requesterId: user.id})
    assert.equal(result.status, 204)
    assertBodyIsEmpty(result.body)
    assertCardIsNotStored(card)
})

cardRouter.run()

