import { Card } from '../../src/models/Card.js'
import { WrittenAnswer } from '../../src/models/WrittenAnswer.js'
import { WrittenQuestion } from '../../src/models/WrittenQuestion.js'
import { assert, suite } from '../test-config.js'

const card = suite('Card')

card('should know how to clone itself', () => {
    const card = new Card('', new WrittenQuestion(''), new WrittenAnswer(''), "label1")
    const clone = card.clone()
    assert.is.not(card, clone)
    assert.equal(card.question.getQuestion(), clone.question.getQuestion())
})

card.run()
