import { DomainError } from '../../src/errors/DomainError.js'
import { ErrorType } from '../../src/errors/ErrorType.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'
const createCard = suite("CreateCard UseCase")

createCard('given data representing a card, when execute this use case, the card should remain in storage', () => {
    const id = new CreateCardUseCase().execute(CardMother.dto())
    const card = new ReadCardUseCase().execute(id)
    assert.equal(CardMother.dto().authorID, card.getAuthorID())
})

createCard('given wrong card data, when execute this use case, it should throw a DomainError with DATA_NOT_VALID code', () => {
    const card = CardMother.dto()
    assert.throws(
        () => new CreateCardUseCase().execute({...CardMother.dto(), authorID: ''}),
        error => error instanceof DomainError &&
            error.getType() === ErrorType.INPUT_DATA_NOT_VALID
    )
})

createCard.run()
