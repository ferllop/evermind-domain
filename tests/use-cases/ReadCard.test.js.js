import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const readCard = suite("ReadCard UseCase")

readCard.before.each(() => InMemoryDatastore.getInstance().clean())

readCard(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new ReadCardUseCase().execute(CardMother.invalidIdDto())
        assert.ok(ResultMother.isInputInvalid(result))
    })

readCard(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomeainError', () => {
        new CreateCardUseCase().execute(CardMother.dto())
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' })
        assert.ok(ResultMother.isNotFound(result))
})

readCard(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomeainError', () => {
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' })
        assert.ok(ResultMother.isNotFound(result))
})

readCard(
    'given an existing id, ' + 
    'should return an object with null as error and card as data', () => {
    new CreateCardUseCase().execute(CardMother.dto())
    const result = new ReadCardUseCase().execute(CardMother.idDto())
    assert.ok(ResultMother.isOkWithDataStrings(result, CardMother.dto(), ['authorID']))
})

readCard.run()
