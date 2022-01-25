import { NullAnswer } from './NullAnswer.js'
import { Question } from './Question.js'

export class NullQuestion extends Question {
    getValue(): null {
        return null;
    }

    clone(): Question {
        return new NullAnswer();
    }
}
