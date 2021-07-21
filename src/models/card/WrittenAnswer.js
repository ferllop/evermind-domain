import { precondition } from '../../lib/preconditions.js'
import { Answer } from './Answer.js'

export class WrittenAnswer extends Answer {
    /**@type {string} */
    answer

    /**@param {string} answer */
    constructor(answer) {
        super()
        precondition(!!answer)
        this.answer = answer
    }

    /**
     * @returns {string}
     */
    getAnswer() {
        return this.answer
    }


    /**
     * @param {string} answer 
     * @returns {boolean}
     */
     static isValid(answer) {
        return Boolean(answer)
    }
}
