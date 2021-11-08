import { ImplementationsContainer } from '../../src/implementations/ImplementationsContainer.js'
import { InMemoryDatastore } from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import { CardDto } from '../../src/models/card/CardDto.js'
import { CardField } from '../../src/models/card/CardField.js'
import { Datastore } from '../../src/models/Datastore.js'
import { ErrorType } from '../../src/models/errors/ErrorType.js'
import { Response } from '../../src/use-cases/Response.js'
import { UserModifiesCardDataUseCase } from '../../src/use-cases/UserModifiesCardDataUseCase.js'
import { CardMother } from '../models/card/CardMother.js'
import { LabellingMother } from '../models/card/LabellingMother.js'
import { DatastoreMother } from '../models/DatastoreMother.js'
import { assert, suite } from '../test-config.js'

const userModifiesCardDataUseCase = suite("User modifies card data use case")

const cardMother = new CardMother()

let datastore: Datastore
userModifiesCardDataUseCase.before.each(() => {
    ImplementationsContainer.set('datastore', new InMemoryDatastore())
    datastore = ImplementationsContainer.get('datastore') as Datastore
})


userModifiesCardDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.dto() })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', () => {
        const dsMother = new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const newAuthorID = 'newAuthorId'
        new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), authorID: newAuthorID })
        assert.equal(newAuthorID, dsMother.stored(1).storedDto?.authorID)
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when provided a different labelling, the card should be updated in storage', () => {
        const dsMother = new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const {id} = dsMother.stored(1).storedDto as CardDto
        const labelling = ['newlabelling']
        new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), labelling })
        assert.equal(labelling, datastore.read<CardDto>(CardField.TABLE_NAME, id)!.labelling)    
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserModifiesCardDataUseCase().execute(
            { userId: '', ...cardMother.numberedDto(1), authorID: 'updatedAuthor' },
        )
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesCardDataUseCase(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError as error', () => {
        new DatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), id: 'notExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.invalidDto() })
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
        const result = new UserModifiesCardDataUseCase().execute(data)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesCardDataUseCase.run()
