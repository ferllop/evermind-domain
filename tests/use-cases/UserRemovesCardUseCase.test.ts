import { ErrorType } from '../../src/errors/ErrorType.js'
import { Datastore } from '../../src/models/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { Response } from '../../src/use-cases/Response.js'
import { UserRemovesCardUseCase } from '../../src/use-cases/UserRemovesCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userRemovesCardUseCase = suite("User removes card use case")

const cardMother = new CardMother()

let datastore: Datastore
userRemovesCardUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})

userRemovesCardUseCase(
    'given an existing card id, ' +
    'should return an object with either ' +
    'data and error properties as null', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
        assert.equal(result, Response.OkWithoutData())
    })

userRemovesCardUseCase('given an existing card id, should remove it', () => {
    const dsMother = new DatastoreMother(cardMother, datastore).having(1).storedIn()
    assert.ok(dsMother.exists(1))
    new UserRemovesCardUseCase().execute(IdentificationMother.numberedDto(1), datastore)
    assert.not.ok(dsMother.exists(1))
})

userRemovesCardUseCase(
    'given an unexisting card id into an existing cards table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserRemovesCardUseCase().execute({ id: 'unexistingID' }, datastore)
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as CARD_NOT_FOUND DomainError', () => {
        const result = new UserRemovesCardUseCase().execute({ id: 'unexistingIDnorTable' }, datastore)
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userRemovesCardUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserRemovesCardUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userRemovesCardUseCase.run()
