import { precondition } from '../../lib/preconditions.js'
import { Question } from './Question.js'

export class WrittenQuestion extends Question {
    private value: string

    constructor(value: string) {
        super()
        precondition(!!value)
        this.value = value
    }

    getQuestion() {
        return this.value
    }

    static isValid(question: string) {
        return Boolean(question)
    }
}
