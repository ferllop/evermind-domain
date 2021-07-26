import { InMemoryDatastore } from '../../src/storage/datastores/InMemoryDatastore.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { UpdateCardUseCase } from '../../src/use-cases/UpdateCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const updateCard = suite("UpdateCard UseCase")

updateCard.before.each(() => InMemoryDatastore.getInstance().clean())

updateCard(
    'given an unexisting table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        const result = new UpdateCardUseCase().execute(CardMother.dto())
        assert.ok(ResultMother.isNotFound(result))
    })

updateCard(
    'given a previously stored card and data to update it, ' +
    'the card should be updated in storage', () => {
        new CreateCardUseCase().execute(CardMother.dto())
        new UpdateCardUseCase().execute({ ...CardMother.dto(), authorID: 'updatedAuthor' })
        const result = new ReadCardUseCase().execute(CardMother.idDto())
        assert.equal(result.data.authorID, 'updatedAuthor')
    })

updateCard(
    'given a previously stored card and data to update it, ' +
    'should return an object with null as error property and ' +
    'null as data property', () => {
        new CreateCardUseCase().execute(CardMother.dto())
        const result = new UpdateCardUseCase().execute({ ...CardMother.dto(), authorID: 'updatedAuthor' })
        assert.ok(ResultMother.isEmptyOk(result))
    })

updateCard(
    'given an unexisting card in an existing table, ' +
    'should return an object with null as data property and ' +
    'RESOURCE_NOT_FOUND DomainError', () => {
        new CreateCardUseCase().execute(CardMother.dto())
        const result = new UpdateCardUseCase().execute({...CardMother.dto(), id: 'notExistingId'})
        assert.ok(ResultMother.isNotFound(result))
    })

updateCard(
    'given wrong card data, ' +
    'should return an object with null as data property and ' +
    'INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new UpdateCardUseCase().execute(CardMother.invalidDto())
        assert.ok(ResultMother.isInputInvalid(result))
    })

updateCard.run()
