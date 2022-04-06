import {suite} from '../../../test-config.js'
import {TestableApp} from '../TestableApp.js'
import {UserRouter} from '../../../../src/delivery/rest-api/routers/UserRouter.js'
import {
    givenACleanInMemoryDatabase,
    givenAStoredCardFromUser,
    givenAStoredUser,
    givenAStoredUserWithPermissions,
    givenASubscription,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreScenarios.js'
import {
    assertSubscriptionIsNotStored,
    assertSubscriptionIsStored,
    assertUserIsNotStored,
    assertUserIsStored,
} from '../../../implementations/persistence/in-memory/InMemoryDatastoreAssertions.js'
import {UserBuilder} from '../../../domain/user/UserBuilder.js'

type Context = {
    app: TestableApp
}

const userRouter = suite<Context>("User router")

userRouter.before.each(async context => {
    await givenACleanInMemoryDatabase()
    context.app = new TestableApp(new UserRouter())
})

userRouter('should return user when post a user and 201 http response', async ({app}) => {
    const {id, ...user} = new UserBuilder().buildDto()
    const result = await app.post('/users', user)
    const expectedUser = {
        id: result.body.domain.data.id,
        ...user,
    }
    app.assert()
        .hasStatusCode(201)
        .domain()
        .hasData(expectedUser)
})

userRouter('when getting by its id should return user and 200 http response', async ({app}) => {
    const user = await givenAStoredUser()
    await app.get('/users/' + user.id, {requesterId: user.id})
    app.assert()
        .hasStatusCode(200)
        .domain()
        .hasData(user)
})

userRouter('when modifying a user should modify user return empty and 204 http response', async ({app}) => {
    const {id, ...createdUser} = await givenAStoredUserWithPermissions(['UPDATE_OWN_PRIVATE_DATA'])
    const renamedUser = {...createdUser, name: 'Carla'}
    await app.put('/users/' + id, {requesterId: id, ...renamedUser})
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    await assertUserIsStored({id, ...renamedUser})
})

userRouter('when modifying an incomplete user return null and 400 http response and user remains unmodified', async ({app}) => {
    const {id, ...createdUser} = await givenAStoredUserWithPermissions(['UPDATE_OWN_PRIVATE_DATA'])
    const renamedToCarla = {name: 'Carla'}
    await app.put('/users/' + id, renamedToCarla)
    app.assert()
        .hasStatusCode(400)
    await assertUserIsStored({id, ...createdUser})
})

userRouter('when deleting a user should delete the user return empty and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['REMOVE_OWN_ACCOUNT'])
    await app.delete('/users/' + user.id, {requesterId: user.id})
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    await assertUserIsNotStored(user)
})

userRouter('when subscribing a user to a card should get the subscription data and 201 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['SUBSCRIBE_ITSELF_TO_CARD'])
    const {id: cardId} = await givenAStoredCardFromUser(user)
    const result = await app.post('/users/' + user.id + '/cards/' + cardId, {requesterId: user.id})
    const expectedSubscription = {
        id: result.body.domain.data.id,
        userId: user.id,
        cardId,
        level: 0,
        lastReview: result.body.domain.data.lastReview,
    }
    app.assert()
        .hasStatusCode(201)
        .domain()
            .hasData(expectedSubscription)
    await assertSubscriptionIsStored(user.id, cardId)
})

userRouter('when unsubscribing a user from a card should get empty array and 204 http response', async ({app}) => {
    const user = await givenAStoredUserWithPermissions(['UNSUBSCRIBE_ITSELF_FROM_CARD'])
    const card = await givenAStoredCardFromUser(user)
    await givenASubscription(user, card)
    await app.post('/users/' + user.id + '/cards/' + card.id)
    await app.delete('/users/' + user.id + '/cards/' + card.id, {requesterId: user.id})
    app.assert()
        .hasStatusCode(204)
        .hasEmptyData()
    await assertSubscriptionIsNotStored(user.id, card.id)
})

userRouter.run()

