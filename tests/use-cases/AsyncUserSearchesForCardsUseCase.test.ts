import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'
import { UserMother } from '../models/user/UserMother.js'
import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import { AsyncDatastore } from '../../src/models/AsyncDatastore.js'
import { AsyncDatastoreMother } from '../models/AsyncDatastoreMother.js'
import { AsyncUserSearchesForCardsUseCase } from '../../src/use-cases/AsyncUserSearchesForCardsUseCase.js'
import { AsyncInMemoryDatastore } from '../../src/implementations/persistence/in-memory/AsyncInMemoryDatastore.js'
import { Dependency } from '../../src/implementations/implementations-container/Dependency.js'

const userSearchesForCards = suite('User searches for cards use case')

const cardMother = new CardMother()

let datastore: AsyncDatastore
userSearchesForCards.before.each(() => {
    ImplementationsContainer.set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
    datastore = ImplementationsContainer.get(Dependency.ASYNC_DATASTORE) as AsyncDatastore
})

userSearchesForCards('having 0 coincident cards, return a Result with empty array as data and null as error', async () => {
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: 'non-existing'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having three cards, with one coincident card, return a Result with a one element array as data and null as error', async () => {
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: 'label0ofcard1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having three cards, with one partial card, return a Result with an empty array as data and null as error', async () => {
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: 'label0ofcard1, otherlabel'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 3 cards stored, two of them with same labels, return a Result with a two elements array as data and null as error', async () => {
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    await datastore.update(cardMother.TABLE_NAME, { id: 'the-id2', labelling:['label0ofcard1']})
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: 'label0ofcard1'})
    assert.is(result.data.length, 2)
})

userSearchesForCards('having 1 card with two coincident labels, return a Result with one element array as data and null as error', async () => {
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    await datastore.update(cardMother.TABLE_NAME, { id: 'the-id1', labelling:['label0ofcard1', 'label0ofcard2']})
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: 'label0ofcard1, label0ofcard2'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', async () => {
    await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: '@non-existing-author'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author, then return a Result with an empty array as data and null as error', async () => {
    await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: '@validUsername1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards('having 0 coincident cards, when searching by author and label, then return a Result with an empty array as data and null as error', async () => {
    await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: '@validUsername1, non-existing-label'})
    assert.is(result.data.length, 0)
})

userSearchesForCards('having 1 coincident cards, when searching by author and label, then return a Result with a one elemnt array as data and null as error', async () => {
    await new AsyncDatastoreMother(new UserMother(), datastore).having(1).storedIn()
    await new AsyncDatastoreMother(cardMother, datastore).having(3).storedIn()
    const result = await new AsyncUserSearchesForCardsUseCase().execute({query: '@validUsername1, label0ofCard1'})
    assert.is(result.data.length, 1)
})

userSearchesForCards.run()
