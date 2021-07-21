import { DomainError } from '../../src/errors/DomainError.js'
import { ErrorType } from '../../src/errors/ErrorType.js'
import { Card } from '../../src/models/card/Card.js'
import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'

const readCard = suite("ReadCard UseCase")

readCard('given invalid id, should throw an INPUT_DATA_NOT_VALID DomainError', () => {
    assert.throws(() => new ReadCardUseCase().execute(''),
        error => error instanceof DomainError && error.getType() === ErrorType.INPUT_DATA_NOT_VALID
    )
})

readCard('given a non existing id, should return null', () => {
    assert.is(new ReadCardUseCase().execute('non-existing'), null)
})

readCard('given an existing id, should return a card with same data', () => {
    const data = CardMother.dto()
    const id = new CreateCardUseCase().execute(data)
    assert.is(new ReadCardUseCase().execute(id).getQuestion().getQuestion(), data.question)
})

readCard('given an existing id, should return a card', () => {
    const data = CardMother.dto()
    const id = new CreateCardUseCase().execute(data)
    assert.instance(new ReadCardUseCase().execute(id), Card)
})

readCard.run()
