import { Answer } from '../../../src/domain/card/Answer.js'
import { AuthorIdentification } from '../../../src/domain/card/AuthorIdentification.js'
import { Card } from '../../../src/domain/card/Card.js'
import { Labelling } from '../../../src/domain/card/Labelling.js'
import { Question } from '../../../src/domain/card/Question.js'
import { WrittenAnswer } from '../../../src/domain/card/WrittenAnswer.js'
import { WrittenQuestion } from '../../../src/domain/card/WrittenQuestion.js'
import { Identification } from '../../../src/domain/shared/value/Identification.js'
import { CardMapper } from '../../../src/domain/card/CardMapper.js'
import { Label } from '../../../src/domain/card/Label.js'

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
        this.labelling = new Labelling([new Label('labelling')])
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
