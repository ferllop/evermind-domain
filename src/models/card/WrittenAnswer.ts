import { precondition } from '../../lib/preconditions.js'
import { Answer } from './Answer.js'

export class WrittenAnswer extends Answer {

    private value: string

    constructor(value: string) {
        super()
        precondition(!!value)
        this.value = value
    }

    getAnswer() {
        return this.value
    }

    static isValid(answer: string) {
        return Boolean(answer)
    }
}
