import { assert, suite } from '../../test-config.js'
import { CardMother } from './CardMother.js'

const card = suite('Card')

card('should know how to clone itself', () => {
    const card = new CardMother().standard()
    const clone = card.clone()
    assert.is.not(card, clone)
    assert.equal(card.getQuestion(), clone.getQuestion())
})

card.run()
