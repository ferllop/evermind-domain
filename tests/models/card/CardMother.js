import { IdentificationMother } from '../value/IdentificationMother.js'
import { CardBuilder } from './CardBuilder.js'
import { LabellingMother } from './LabellingMother.js'

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
            labelling: LabellingMother.dto().labelling,
            ...IdentificationMother.dto()
        }
    }

    /** @param {number} number */
    static numberedDto(number) {
        const dto = this.dto()
        return {
            authorID: dto.authorID + number,
            question: dto.question + number,
            answer: dto.answer + number,
            id: dto.id + number,
            ...LabellingMother.numberedDto(number)
        }
    }

    static invalidDto() {
        return { ...CardMother.dto(), ...IdentificationMother.invalidDto(), authorID:''}
    }

}
