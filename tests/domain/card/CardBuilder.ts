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
import {Visibility} from '../../../src/domain/card/Card.js'
import {AlwaysAuthorizedAuthorization} from '../../implementations/AlwaysAuthorizedAuthorization.js'

export class CardBuilder {

    id: Identification
    authorId: AuthorIdentification
    question: Question
    answer: Answer
    labelling: Labelling
    visibility: Visibility

    constructor() {
        this.id = Identification.create()
        this.authorId = AuthorIdentification.create() as AuthorIdentification
        this.question = new WrittenQuestion('question')
        this.answer = new WrittenAnswer('answer')
        this.labelling = new Labelling([new Label('labelling')])
        this.visibility = 'PUBLIC'
    }

    setId(id: Identification) {
        this.id = id
        return this
    }

    setAuthorId(authorId: AuthorIdentification) {
        this.authorId = authorId
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
        this.authorId = new AuthorIdentification(id)
        return this
    }

    withLabels(labels: string[]) {
        this.labelling = Labelling.fromStringLabels(labels)
        return this
    }

    withVisibility(visibility: Visibility) {
        this.visibility = visibility
        return this
    }

    build() {
        const cardFactory = new CardFactory(new AlwaysAuthorizedAuthorization())
        return cardFactory.recreate(this.authorId, this.question, this.answer, this.labelling, this.visibility, this.id)
    }

    buildDto() {
        return this.build().toDto()
    }
}
