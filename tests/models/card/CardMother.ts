import { Card } from '../../../src/models/card/Card.js'
import { CardDto } from '../../../src/models/card/CardDto.js'
import { Identification } from '../../../src/models/value/Identification.js'
import { CardMapper } from '../../../src/models/card/CardMapper.js'
import { Mother } from "../../models/Mother.js"
import { IdentificationMother } from '../value/IdentificationMother.js'
import { CardBuilder } from './CardBuilder.js'
import { LabellingMother } from './LabellingMother.js'

export class CardMother implements Mother<CardDto>{
    card: Card = new CardBuilder().build()
    TABLE_NAME = 'cards'

    standard() {
        return new CardMapper().fromDto(this.dto())
    }

    dto(): CardDto {
        return {
            authorID: IdentificationMother.dto().id,
            question: 'question',
            answer: 'answer',
            ...LabellingMother.dto(),
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

    withId(id: string) {
        this.card = new CardBuilder().setId(new Identification(id)).build()
        return this
    }

    getDto() {
       return new CardMapper().toDto(this.card) 
    }

}
