import { precondition } from '../../lib/preconditions.js'
import { Question } from './Question.js'

export class WrittenQuestion extends Question {
    /**@type {string} */
    question

    /**@param {string} question */
    constructor(question) {
        super()
        precondition(!!question)
        this.question = question
    }

    /**
     * @returns {string}
     */
    getQuestion() {
        return this.question
    }

    /**
     * @param {string} question 
     * @returns {boolean}
     */
    static isValid(question) {
        return Boolean(question)
    }
}
