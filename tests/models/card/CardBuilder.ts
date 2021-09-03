import { Answer } from '../../../src/models/card/Answer.js'
import { AuthorIdentification } from '../../../src/models/card/AuthorIdentification.js'
import { Card } from '../../../src/models/card/Card.js'
import { Labelling } from '../../../src/models/card/Labelling.js'
import { Question } from '../../../src/models/card/Question.js'
import { WrittenAnswer } from '../../../src/models/card/WrittenAnswer.js'
import { WrittenQuestion } from '../../../src/models/card/WrittenQuestion.js'
import { Identification } from '../../../src/models/value/Identification.js'
import { CardMapper } from '../../../src/storage/storables/CardMapper.js'

export class CardBuilder {

    id: Identification
    authorID: AuthorIdentification
    question: Question
    answer: Answer
    labelling: Labelling

    constructor() {
        this.id = Identification.create()
        this.authorID = new AuthorIdentification(Identification.create().toString())
        this.question = new WrittenQuestion('question')
        this.answer = new WrittenAnswer('answer')
        this.labelling = new Labelling('labelling')
    }

    setId(id: Identification) {
        this.id = id
        return this
    }

    setAuthorID(authorID: AuthorIdentification) {
        this.authorID = authorID
        return this
    }

    setQuestion(question: Question) {
        this.question = question
        return this
    }

    setAnswer(answer: Answer) {
        this.answer = answer
        return this
    }

    setLabelling(labelling: Labelling) {
        this.labelling = labelling
        return this
    }

    build() {
        return Card.recreate(this.authorID, this.question, this.answer, this.labelling, this.id)
    }

    buildDto() {
        return new CardMapper().toDto(this.build())
    }
}
