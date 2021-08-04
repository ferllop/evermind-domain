import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Identified } from '../datastores/Identified.js'

export class CardMapper {
    
    static isDtoValid(dto: CardDto): boolean {
        return Boolean(dto) && Card.isValid(dto.authorID, dto.question, dto.answer, dto.labelling)
    }

    static fromDto(dto: Identified<CardDto>): Card {
        precondition(CardMapper.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling, dto.id)
    }

    static fromDtoArray(dtoArray: Identified<CardDto>[]): Card[] {
        return dtoArray.map(cardDto => CardMapper.fromDto(cardDto))
    }
    
    static toDto(card: Card): Identified<CardDto> {
        return {
            id: card.getId().toString(),
            authorID: card.getAuthorID().toString(),
            question: card.getQuestion().getQuestion(),
            answer: card.getAnswer().getAnswer(),
            labelling: card.getLabelling().getLabels()
        }
    }
}
