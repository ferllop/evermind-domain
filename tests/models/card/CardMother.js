import { uuid } from '../../../src/lib/uuid.js'
import { CardBuilder } from './CardBuilder.js'

export class CardMother {
    static standard() {
        return new CardBuilder()
            .setAuthorID(this.dto().authorID)
            .setQuestion(this.dto().question)
            .setAnswer(this.dto().answer)
            .setLabelling(this.dto().labelling)
            .build()
    }

    static dto() {
        return {
            authorID: 'authorID',
            question: 'question',
            answer: 'answer',
            labelling: ['labelling'],
            ...CardMother.idDto()
        }
    }

    static invalidDto() {
        return { ...CardMother.dto(), ...this.invalidIdDto(), authorID:''}
    }

    static invalidIdDto() {
        return { id: ''}
    }

    static idDto(){
        return { id: 'the-id'}
    }
}
