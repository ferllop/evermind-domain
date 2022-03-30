import {assert, suite} from '../../test-config.js'
import {CardBuilder} from './CardBuilder.js'

const card = suite('Card')

card('should know how to clone itself', () => {
    const card = new CardBuilder().build()
    const clone = card.clone()
    assert.is.not(card, clone)
    assert.equal(card.toDto().question, clone.toDto().question)
})

card.run()
