import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { DatastoreTestClass } from '../storage/datastores/DatastoreTestClass.js'

const createCard = suite("CreateCard UseCase")

const cardMother = new CardMother()

let datastore: Datastore
createCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

createCard(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = new CreateCardUseCase().execute(cardMother.dto(), datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

createCard(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        const datastore = new DatastoreTestClass()
        new CreateCardUseCase().execute(cardMother.dto(), datastore)
        assert.ok(new DatastoreMother(cardMother, datastore).isDataStored(datastore.dtoId, 'authorId'))
    })

createCard(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new CreateCardUseCase().execute(cardMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

createCard.run()

