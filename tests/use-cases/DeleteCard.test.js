import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { DeleteCardUseCase } from '../../src/use-cases/DeleteCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const deleteCard = suite("DeleteCard UseCase")

/** @type {Datastore} */
let datastore
deleteCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

deleteCard(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        new DatastoreMother(CardMother, datastore).having(1).storedIn()
        const result = new DeleteCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

deleteCard('given an existing card id, should remove it', () => {
    const dsMother = new DatastoreMother(CardMother, datastore).having(1).storedIn()
    assert.ok(dsMother.exists(1))
    new DeleteCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
    assert.not.ok(dsMother.exists(1))
})

deleteCard(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(CardMother, datastore).having(1).storedIn()
        const result = new DeleteCardUseCase().execute({ id: 'unexistingID' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

deleteCard(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        const result = new DeleteCardUseCase().execute({ id: 'unexistingIDnorTable' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

deleteCard(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new DeleteCardUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

deleteCard.run()
