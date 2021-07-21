import { CreateCardUseCase } from '../../src/use-cases/CreateCard.js'
import { DeleteCardUseCase } from '../../src/use-cases/DeleteCard.js'
import { ReadCardUseCase } from '../../src/use-cases/ReadCard.js'
import { CardMother } from '../models/card/CardMother.js'
import { assert, suite } from '../test-config.js'

const deleteCard = suite("DeleteCard UseCase")

deleteCard('given a card, when execute this use case, the card should be deleted from storage', () => {
    const id = new CreateCardUseCase().execute(CardMother.dto())
    assert.ok(new DeleteCardUseCase().execute(id))
    assert.is(new ReadCardUseCase().execute(id), null)
})

deleteCard('given unexisting card id, when execute this use case, it should return false', () => {
    assert.is(new DeleteCardUseCase().execute('not-existing-id'), false)
})

deleteCard.run()
