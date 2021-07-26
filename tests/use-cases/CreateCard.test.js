import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { ResultMother } from '../models/value/ResultMother.js'
import { assert, suite } from '../test-config.js'

const createCard = suite("CreateCard UseCase")

createCard(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'an object should be returned with either error and data properties being null', () => {
        const result = new CreateCardUseCase().execute(CardMother.dto())
        assert.ok(ResultMother.isEmptyOk(result))
    })

createCard(
    'given data representing a card, ' +
    'when execute this use case, ' +
    'the card should remain in storage', () => {
        new CreateCardUseCase().execute(CardMother.dto())
        const result = new ReadCardUseCase().execute(CardMother.idDto())
        assert.ok(ResultMother.isOkWithDataStrings(result, CardMother.dto(), ['authorID']))
    })

createCard(
    'given wrong card data, ' +
    'when execute this use case, ' +
    'it should return an object with a data property as null and ' +
    'error property with a INPUT_DATA_NOT_VALID DomainError', () => {
        const result = new CreateCardUseCase().execute(CardMother.invalidDto())
        assert.ok(ResultMother.isInputInvalid(result))
    })

createCard.run()
