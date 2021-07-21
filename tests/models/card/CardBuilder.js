import { Card } from '../../../src/models/card/Card.js'

export class CardBuilder {
    /**@type {string} */
    authorID
    
    /**@type {string} */
    question
    
    /**@type {string} */
    answer

    /**@type {string[]} */
    labelling;

    constructor() {
        this.authorID = ''
        this.question = 'question'
        this.answer = 'answer'
        this.labelling = ['labelling']
    }

    setAuthorID(authorID) {
        this.authorID = authorID
        return this
    }

    setQuestion(question) {
        this.question = question
        return this
    }

    setAnswer(answer) {
        this.answer = answer
        return this
    }

    /**
     * @param {string[]} labelling
     * @returns 
     */
    setLabelling(labelling) {
        this.labelling = labelling
        return this
    }

    build() {
        return new Card(this.authorID, this.question, this.answer, this.labelling)
    }
}
