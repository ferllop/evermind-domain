import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Identification } from '../../models/value/Identification.js'
import { Identified } from '../datastores/Identified.js'
import { Mapper } from './Mapper'

export class CardMapper implements Mapper<Card, CardDto> {
    
    isDtoValid(dto: CardDto): boolean {
        return Boolean(dto) && Card.isValid(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    fromDto(dto: Identified<CardDto>): Card {
        precondition(this.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling, new Identification(dto.id) )
    }

    fromDtoArray(dtoArray: Identified<CardDto>[]): Card[] {
        return dtoArray.map(cardDto => this.fromDto(cardDto))
    }
    
    toDto(card: Card): Identified<CardDto> {
        return {
            id: card.getId().toString(),
            authorID: card.getAuthorID().toString(),
            question: card.getQuestion().getQuestion(),
            answer: card.getAnswer().getAnswer(),
            labelling: card.getLabelling().getLabels()
        }
    }
}
