import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { DeleteCardUseCase } from '../../src/use-cases/DeleteCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const deleteCard = suite("DeleteCard UseCase")

/** @type {Datastore} */
let datastore

deleteCard.before.each(context => {
    datastore = new InMemoryDatastore()
})

deleteCard(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        CardMother.having(1).storedIn(datastore)
        const result = new DeleteCardUseCase().execute(CardMother.numberedIdDto(1), datastore)
        assert.ok(ResultMother.isEmptyOk(result))
    })

deleteCard('given an existing card id, should remove it', () => {
    CardMother.having(1).storedIn(datastore)
    assert.ok(CardMother.cardExists(1, datastore))
    new DeleteCardUseCase().execute(CardMother.numberedIdDto(1), datastore)
    assert.not.ok(CardMother.cardExists(1, datastore))
})

deleteCard(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        CardMother.having(1).storedIn(datastore)
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
        const result = new DeleteCardUseCase().execute(CardMother.invalidIdDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

deleteCard.run()
