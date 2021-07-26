import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { DeleteCardUseCase } from '../../src/use-cases/DeleteCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const deleteCard = suite("DeleteCard UseCase")

deleteCard.before.each(() => InMemoryDatastore.getInstance().clean())

deleteCard(
    'given an existing card id, ' + 
    'should return an object with either ' + 
    'data and error properties as null', () => {
    new CreateCardUseCase().execute(CardMother.dto())
    const result = new DeleteCardUseCase().execute(CardMother.idDto())
    assert.ok(ResultMother.isEmptyOk(result))
})

deleteCard('given an existing card id, should remove it', () => {
    new CreateCardUseCase().execute(CardMother.dto())
    new DeleteCardUseCase().execute(CardMother.idDto())
    const result = new ReadCardUseCase().execute(CardMother.idDto())
    const isRemoved = ResultMother.isNotFound
    assert.ok(isRemoved(result))
})

deleteCard(
    'given an unexisting card id into an existing cards table, ' + 
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
    new CreateCardUseCase().execute(CardMother.dto())
    const result = new DeleteCardUseCase().execute({id:'unexistingID'})
    assert.ok(ResultMother.isNotFound(result))
})

deleteCard(
    'given an unexisting table, ' + 
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
    const result = new DeleteCardUseCase().execute({id:'unexistingIDnorTable'})
    assert.ok(ResultMother.isNotFound(result))
})

deleteCard(
    'given an invalid id, ' + 
    'should return an object with data property as null ' + 
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
    const result = new DeleteCardUseCase().execute(CardMother.invalidIdDto())
    assert.ok(ResultMother.isInputInvalid(result))
})

deleteCard.run()
