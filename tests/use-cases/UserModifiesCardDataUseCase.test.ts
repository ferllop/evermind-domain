import { ErrorType } from '../../src/errors/ErrorType.js'
import { Datastore } from '../../src/models/Datastore.js'
import { Response } from '../../src/models/value/Response.js'
import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { UserModifiesCardDataUseCase } from '../../src/use-cases/UserModifiesCardDataUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { LabellingMother } from '../models/card/LabellingMother.js'
import { DatastoreMother } from '../storage/datastores/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userModifiesCardDataUseCase = suite("User modifies card data use case")

const cardMother = new CardMother()

let datastore: Datastore
userModifiesCardDataUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})


userModifiesCardDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.dto() }, datastore)
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', () => {
        const dsMother = new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const newAuthorID = 'newAuthorId'
        new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), authorID: newAuthorID }, datastore)
        assert.ok(dsMother.stored(1).hasPropertyValue('authorID', newAuthorID))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserModifiesCardDataUseCase().execute(
            { userId: '', ...cardMother.numberedDto(1), authorID: 'updatedAuthor' },
            datastore)
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesCardDataUseCase(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError as error', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), id: 'notExistingId' }, datastore)
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.invalidDto() }, datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesCardDataUseCase(
    'given wrong labelling in card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const data = {
            userId: '',
            ...cardMother.dto(),
            ...LabellingMother.invalidDto()
        }
        const result = new UserModifiesCardDataUseCase().execute(data, datastore)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesCardDataUseCase.run()
