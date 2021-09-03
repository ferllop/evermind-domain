import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UpdateCardUseCase } from '../../src/use-cases/UpdateCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const updateCard = suite("UpdateCard UseCase")

const cardMother = new CardMother()

let datastore: Datastore
updateCard.before.each(() => {
    datastore = new InMemoryDatastore()
})


updateCard(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UpdateCardUseCase().execute(cardMother.dto(), datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

updateCard(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', () => {
        const dsMother = new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const newAuthorID = 'newAuthorId'
        new UpdateCardUseCase().execute({ ...cardMother.numberedDto(1), authorID: newAuthorID }, datastore)
        assert.ok(dsMother.stored(1).hasPropertyValue('authorID', newAuthorID))
    })

updateCard(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UpdateCardUseCase().execute(
            { ...cardMother.numberedDto(1), authorID: 'updatedAuthor' }, 
            datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

updateCard(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UpdateCardUseCase().execute({...cardMother.numberedDto(1), id: 'notExistingId'}, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

updateCard(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UpdateCardUseCase().execute(cardMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

updateCard.run()
