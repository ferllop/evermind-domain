import { Card } from '../../../src/models/card/Card.js'
import { Identification } from '../../../src/models/value/Identification.js'

export class CardBuilder {
    /**@type {string} */
    authorID
    
    /**@type {string} */
    question
    
    /**@type {string} */
    answer

    /**@type {string[]} */
    labelling;

    /** @type {string} */
    id

    constructor() {
        this.authorID = ''
        this.question = 'question'
        this.answer = 'answer'
        this.labelling = ['labelling']
        this.id = ''
    }

    /**
     * @param {string} authorID 
     * @returns {CardBuilder}
     */
    setAuthorID(authorID) {
        this.authorID = authorID
        return this
    }

    /**
     * @param {string} question 
     * @returns {CardBuilder}
     */
    setQuestion(question) {
        this.question = question
        return this
    }

    /**
     * @param {string} answer 
     * @returns {CardBuilder}
     */
    setAnswer(answer) {
        this.answer = answer
        return this
    }

    /**
     * @param {string[]} labelling
     * @returns {CardBuilder}
     */
    setLabelling(labelling) {
        this.labelling = labelling
        return this
    }

    /**
     * @param {string} id 
     * @returns {CardBuilder}
     */
    setId(id) {
        this.id = id
        return this
    }

    /**
     * @returns {Card}
     */
    build() {
        return new Card(this.authorID, this.question, this.answer, this.labelling, new Identification(this.id))
    }
}
