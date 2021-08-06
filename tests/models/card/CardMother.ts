import { CardDto } from '../../../src/models/card/CardDto.js'
import { CardMapper } from '../../../src/storage/storables/CardMapper.js'
import { Mother } from '../../storage/datastores/DatastoreMother.js'
import { IdentificationMother } from '../value/IdentificationMother.js'
import { LabellingMother } from './LabellingMother.js'

export class CardMother implements Mother<CardDto>{
    TABLE_NAME = 'cards'

    standard() {
        return new CardMapper().fromDto(this.dto())
    }

    dto(): CardDto {
        return {
            authorID: IdentificationMother.dto().id,
            question: 'question',
            answer: 'answer',
            labelling: LabellingMother.dto().labelling,
            ...IdentificationMother.dto()
        }
    }

    numberedDto(number: number): CardDto {
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
