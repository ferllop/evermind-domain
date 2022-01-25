import {Answer} from '../../../src/domain/card/Answer.js'
import {AuthorIdentification} from '../../../src/domain/card/AuthorIdentification.js'
import {Labelling} from '../../../src/domain/card/Labelling.js'
import {Question} from '../../../src/domain/card/Question.js'
import {WrittenAnswer} from '../../../src/domain/card/WrittenAnswer.js'
import {WrittenQuestion} from '../../../src/domain/card/WrittenQuestion.js'
import {Identification} from '../../../src/domain/shared/value/Identification.js'
import {Label} from '../../../src/domain/card/Label.js'
import {CardIdentification} from '../../../src/domain/card/CardIdentification.js'
import {CardFactory} from '../../../src/domain/card/CardFactory.js'

export class CardBuilder {

    id: Identification
    authorID: AuthorIdentification
    question: Question
    answer: Answer
    labelling: Labelling

    constructor() {
        this.id = Identification.create()
        this.authorID = AuthorIdentification.create() as AuthorIdentification
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

    withId(id: string) {
        this.id = new CardIdentification(id)
        return this
    }

    withAuthorId(id: string) {
        this.authorID = new AuthorIdentification(id)
        return this
    }

    withLabels(labels: string[]) {
        this.labelling = Labelling.fromStringLabels(labels)
        return this
    }

    build() {
        return new CardFactory().recreate(this.authorID, this.question, this.answer, this.labelling, this.id)
    }

    buildDto() {
        return this.build().toDto()
    }
}
