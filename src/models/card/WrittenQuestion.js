import { Question } from './Question.js'

export class WrittenQuestion extends Question {
    /**@type {string} */
    question

    /**@param {string} question */
    constructor(question) {
        super()
        this.question = question
    }

    /**
     * @returns {string}
     */
    getQuestion() {
        return this.question
    }
}
