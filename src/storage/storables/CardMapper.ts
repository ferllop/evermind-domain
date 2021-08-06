import { precondition } from '../../lib/preconditions.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Identification } from '../../models/value/Identification.js'
import { Mapper } from './Mapper'
import { MayBeIdentified } from './MayBeIdentified'

export class CardMapper implements Mapper<Card, CardDto> {

    isDtoValid(dto: MayBeIdentified<CardDto>): boolean {
        return Boolean(dto) &&
            Card.isValid(
                dto.authorID,
                dto.question,
                dto.answer,
                dto.labelling,
                'id' in dto ? dto.id : undefined
            )
    }

    fromDto(dto: CardDto): Card {
        precondition(this.isDtoValid(dto))
        return new Card(dto.authorID, dto.question, dto.answer, dto.labelling, new Identification(dto.id))
    }

    fromDtoArray(dtoArray: CardDto[]): Card[] {
        return dtoArray.map(cardDto => this.fromDto(cardDto))
    }

    toDto(card: Card): CardDto {
        return {
            id: card.getId().toString(),
            authorID: card.getAuthorID().toString(),
            question: card.getQuestion().getQuestion() as string,
            answer: card.getAnswer().getAnswer() as string,
            labelling: card.getLabelling().getLabels()
        }
    }
}
