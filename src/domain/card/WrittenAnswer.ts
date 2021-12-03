import { precondition } from '../../implementations/preconditions.js'
import { Answer } from './Answer.js'

export class WrittenAnswer extends Answer {

    private readonly value: string

    constructor(value: string) {
        super()
        precondition(WrittenAnswer.isValid(value))
        this.value = value
    }

    getValue() {
        return this.value
    }

    clone(): WrittenAnswer {
        return new WrittenAnswer(this.value)
    }

    static isValid(answer: string) {
        return Boolean(answer)
    }
}
