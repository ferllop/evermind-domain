import { Card } from '../../../src/models/card/Card.js'
import { Identification } from '../../../src/models/value/Identification.js'

export class CardBuilder {

    id: string
    authorID: string
    question: string
    answer: string
    labelling: string[]

    constructor() {
        this.id = ''
        this.authorID = ''
        this.question = 'question'
        this.answer = 'answer'
        this.labelling = ['labelling']
    }

    setId(id: string) {
        this.id = id
        return this
    }

    setAuthorID(authorID: string) {
        this.authorID = authorID
        return this
    }

    setQuestion(question: string) {
        this.question = question
        return this
    }

    setAnswer(answer: string) {
        this.answer = answer
        return this
    }

    setLabelling(labelling: string[]) {
        this.labelling = labelling
        return this
    }

    build() {
        return new Card(this.authorID, this.question, this.answer, this.labelling, new Identification(this.id))
    }
}
