import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
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
        const result = new ReadCardUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

readCard(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(CardMother, datastore).having(1).storedIn()
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readCard(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

readCard(
    'given an existing id, ' +
    'should return an object with null as error and card as data', () => {
        new DatastoreMother(CardMother, datastore).having(1).storedIn()
        const result = new ReadCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        ResultMother.isOkWithDataStrings(result, CardMother.numberedDto(1), 'authorID')
        assert.ok(true)
    })

readCard.run()
