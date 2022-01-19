import {CardDto} from '../../src/domain/card/CardDto.js'
import {CardField} from '../../src/implementations/persistence/in-memory/CardField.js'
import {ErrorType} from '../../src/domain/errors/ErrorType.js'
import {Response} from '../../src/use-cases/Response.js'
import {UserModifiesCardDataUseCase} from '../../src/use-cases/UserModifiesCardDataUseCase.js'
import {CardMother} from '../domain/card/CardMother.js'
import {LabellingMother} from '../domain/card/LabellingMother.js'
import {assert, suite} from '../test-config.js'
import {InMemoryDatastore} from '../../src/implementations/persistence/in-memory/InMemoryDatastore.js'
import {InMemoryDatastoreMother} from '../implementations/persistence/in-memory/InMemoryDatastoreMother.js'

const userModifiesCardDataUseCase = suite("User modifies card data use case")

const cardMother = new CardMother()

let datastore: InMemoryDatastore
userModifiesCardDataUseCase.before.each(() => {
    datastore = new InMemoryDatastore()
})


userModifiesCardDataUseCase(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError', async () => {
        const result = await new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.dto() })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', async () => {
        const dsMother = await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const newAuthorID = 'newAuthorId'
        await new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), authorID: newAuthorID })
        assert.equal(newAuthorID, (await dsMother.stored(1)).storedDto?.authorID)
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'when provided a different labelling, the card should be updated in storage', async () => {
        const dsMother = await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const {id} = (await dsMother.stored(1)).storedDto as CardDto
        const labelling = ['new-labelling']
        await new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), labelling })
        assert.equal(labelling, (await datastore.read<CardDto>(CardField.TABLE_NAME, id))!.labelling)    
    })

userModifiesCardDataUseCase(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', async () => {
        await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserModifiesCardDataUseCase().execute(
            { userId: '', ...cardMother.numberedDto(1), authorID: 'updatedAuthor' },
        )
        assert.equal(result, Response.OkWithoutData())
    })

userModifiesCardDataUseCase(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'CARD_NOT_FOUND DomainError as error', async () => {
        await new InMemoryDatastoreMother(cardMother, datastore).having(1).storedIn()
        const result = await new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.numberedDto(1), id: 'notExistingId' })
        assert.equal(result, Response.withError(ErrorType.CARD_NOT_FOUND))
    })

userModifiesCardDataUseCase(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const result = await new UserModifiesCardDataUseCase().execute({ userId: '', ...cardMother.invalidDto() })
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesCardDataUseCase(
    'given wrong labelling in card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', async () => {
        const data = {
            userId: '',
            ...cardMother.dto(),
            ...LabellingMother.invalidDto()
        }
        const result = await new UserModifiesCardDataUseCase().execute(data)
        assert.equal(result, Response.withError(ErrorType.INPUT_DATA_NOT_VALID))
    })

userModifiesCardDataUseCase.run()
