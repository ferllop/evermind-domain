import { CardDto } from '../../../src/models/card/CardDto.js'
import { Identified } from '../../../src/storage/datastores/Identified.js'
import { Mother } from '../../storage/datastores/DatastoreMother.js'
import { IdentificationMother } from '../value/IdentificationMother.js'
import { CardBuilder } from './CardBuilder.js'
import { LabellingMother } from './LabellingMother.js'

export class CardMother implements Mother<Identified<CardDto>>{
    TABLE_NAME = 'cards'

    standard() {
        return new CardBuilder()
            .setAuthorID(this.dto().authorID)
            .setQuestion(this.dto().question)
            .setAnswer(this.dto().answer)
            .setLabelling(this.dto().labelling)
            .build()
    }

    dto(): Identified<CardDto> {
        return {
            authorID: IdentificationMother.dto().id,
            question: 'question',
            answer: 'answer',
            labelling: LabellingMother.dto().labelling,
            ...IdentificationMother.dto()
        }
    }

    numberedDto(number: number): Identified<CardDto> {
        const dto = this.dto()
        return {
            authorID: dto.authorID + number,
            question: dto.question + number,
            answer: dto.answer + number,
            id: dto.id + number,
            ...LabellingMother.numberedDto(number)
        }
    }

    invalidDto() {
        return { ...this.dto(), ...IdentificationMother.invalidDto(), authorID:''}
    }

}
