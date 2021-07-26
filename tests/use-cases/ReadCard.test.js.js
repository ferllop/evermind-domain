import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const readCard = suite("ReadCard UseCase")

/**@type {Datastore} */
let datastore
readCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

readCard(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new ReadCardUseCase().execute(CardMother.invalidIdDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

readCard(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomeainError', () => {
        CardMother.having(1).storedIn(datastore)
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readCard(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomeainError', () => {
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readCard(
    'given an existing id, ' +
    'should return an object with null as error and card as data', () => {
        CardMother.having(1).storedIn(datastore)
        const result = new ReadCardUseCase().execute(CardMother.numberedIdDto(1), datastore)
        assert.ok(ResultMother.isOkWithDataStrings(result, CardMother.numberedDto(1), ['authorID']))
    })

readCard.run()
