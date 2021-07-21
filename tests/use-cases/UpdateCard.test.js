import { DomainError } from '../../src/errors/DomainError.js'
import { ErrorType } from '../../src/errors/ErrorType.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { UpdateCardUseCase } from '../../src/use-cases/UpdateCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'

const updateCard = suite("UpdateCard UseCase")

updateCard('given a previously stored card and data to update it, when execute this use case, the card should be updated in storage', () => {
    const id = new CreateCardUseCase().execute(CardMother.dto())
    new UpdateCardUseCase().execute(id, {...CardMother.dto(), authorID: 'firstAuthor'})
    assert.equal(new ReadCardUseCase().execute(id).getAuthorID(), 'firstAuthor')
    new UpdateCardUseCase().execute(id, {...CardMother.dto(), authorID: 'newAuthor'})
    assert.equal(new ReadCardUseCase().execute(id).getAuthorID(), 'newAuthor')
})

updateCard('given wrong card data, when execute this use case, it should throw a DomainError with DATA_NOT_VALID code', () => {
    const id = new CreateCardUseCase().execute(CardMother.dto())
    const card = CardMother.dto()
    assert.throws(
        () => new UpdateCardUseCase().execute(id, {...CardMother.dto(), authorID: ''}),
        error => error instanceof DomainError && 
            error.getType() === ErrorType.INPUT_DATA_NOT_VALID
    )
})

updateCard.run()
