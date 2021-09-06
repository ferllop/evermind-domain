import { Datastore } from '../../src/storage/datastores/Datastore.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UserRemovesCardUseCase } from '../../src/use-cases/UserRemovesCardUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { IdentificationMother } from '../models/value/IdentificationMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
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
        assert.ok(ResultMother.isEmptyOk(result))
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
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserRemovesCardUseCase().execute({ id: 'unexistingID' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userRemovesCardUseCase(
    'given an unexisting table, ' +
    'it should return an object with data property as null and ' +
    'error property as RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserRemovesCardUseCase().execute({ id: 'unexistingIDnorTable' }, datastore)
        assert.ok(ResultMother.isNotFound(result))
    })

userRemovesCardUseCase(
    'given an invalid id, ' +
    'should return an object with data property as null ' +
    'and error property as INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserRemovesCardUseCase().execute(IdentificationMother.invalidDto(), datastore)
        assert.ok(ResultMother.isInputInvalid(result))
    })

userRemovesCardUseCase.run()
