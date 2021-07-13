import { Answer } from './Answer.js'

export class WrittenAnswer extends Answer {
    /**@type {string} */
    answer

    /**@param {string} answer */
    constructor(answer) {
        super()
        this.answer = answer
    }

    /**
     * @returns {string}
     */
    getAnswer() {
        return this.answer
    }
}
