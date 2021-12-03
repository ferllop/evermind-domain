import { precondition } from '../../implementations/preconditions.js'
import { Question } from './Question.js'

export class WrittenQuestion extends Question {
    
    private readonly value: string

    constructor(value: string) {
        super()
        precondition(WrittenQuestion.isValid(value))
        this.value = value
    }

    getValue() {
        return this.value
    }

    clone(): WrittenQuestion {
        return new WrittenQuestion(this.value)
    }

    static isValid(question: string) {
        return Boolean(question)
    }
}
