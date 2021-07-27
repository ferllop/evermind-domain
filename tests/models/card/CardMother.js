import { IdentificationMother } from '../value/IdentificationMother.js'
import { CardBuilder } from './CardBuilder.js'

export class CardMother {
    static TABLE_NAME = 'cards'

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
            ...IdentificationMother.dto()
        }
    }

    static numberedDto(number) {
        const dto = this.dto()
        return {
            authorID: dto.authorID + number,
            question: dto.question + number,
            answer: dto.answer + number,
            labelling: [dto.labelling[0] + number],
            id: dto.id + number
        }
    }

    static invalidDto() {
        return { ...CardMother.dto(), ...IdentificationMother.invalidDto(), authorID:''}
    }

}
