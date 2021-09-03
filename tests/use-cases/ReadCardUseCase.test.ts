import { ErrorType } from '../../src/errors/ErrorType.js'
import { Response } from '../../src/models/value/Response.js'
import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const readCard = suite("ReadCard UseCase")

const cardMother = new CardMother()

let datastore: Datastore
readCard.before.each(() => {
    datastore = new InMemoryDatastore()
})

readCard(
    'given invalid id, ' +
    'should return an object with data property as null and ' +
    'error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new ReadCardUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

readCard(
    'given a non existing id in an existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.equal(result, Response.withError(ErrorType.RESOURCE_NOT_FOUND))
    })

readCard(
    'given a non existing cards table, ' +
    'should return an object with data property as null ' +
    'and RESOURCE_NOT_FOUND DomainError', () => {
        const result = new ReadCardUseCase().execute({ id: 'nonExistingId' }, datastore)
        assert.equal(result, Response.withError(ErrorType.RESOURCE_NOT_FOUND))
    })

readCard(
    'given an existing id, ' +
    'should return an object with null as error and card as data', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new ReadCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        ResultMother.isOkWithDataStrings(result, cardMother.numberedDto(1), 'authorID')
        assert.ok(true)
    })

readCard.run()
