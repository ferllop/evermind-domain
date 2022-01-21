import {assert, suite} from '../../test-config.js'
import {CardBuilder} from './CardBuilder'

const card = suite('Card')

card('should know how to clone itself', () => {
    const card = new CardBuilder().build()
    const clone = card.clone()
    assert.is.not(card, clone)
    assert.equal(card.getQuestion(), clone.getQuestion())
})

card.run()
