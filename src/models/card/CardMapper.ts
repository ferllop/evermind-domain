import { precondition } from '../../lib/preconditions.js'
import { AuthorIdentification } from '../../models/card/AuthorIdentification.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Labelling } from '../../models/card/Labelling.js'
import { WrittenAnswer } from '../../models/card/WrittenAnswer.js'
import { WrittenQuestion } from '../../models/card/WrittenQuestion.js'
import { Mapper } from '../Mapper.js'
import { Validator } from '../Validator.js'
import { MayBeIdentified } from '../value/MayBeIdentified.js'
import { CardIdentification } from './CardIdentification.js'
import { Label } from './Label.js'

export class CardMapper extends Mapper<Card, CardDto> {

    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', CardIdentification.isValid)
            .set('answer', WrittenAnswer.isValid)
            .set('question', WrittenQuestion.isValid)
            .set('labelling', Labelling.isValid)
            .set('authorID', AuthorIdentification.isValid)
    }

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
        return Card.recreate(
            new AuthorIdentification(dto.authorID),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            new Labelling(dto.labelling.map(labelStr => new Label(labelStr))),
            new CardIdentification(dto.id))
    }

    fromDtoArray(dtoArray: CardDto[]): Card[] {
        return dtoArray.map(cardDto => this.fromDto(cardDto))
    }

    toDto(card: Card): CardDto {
        return {
            id: card.getId().getId(),
            authorID: card.getAuthorID().getId(),
            question: card.getQuestion().getValue() as string,
            answer: card.getAnswer().getValue() as string,
            labelling: card.getLabelling().getLabels().map(label => label.toString())
        }
    }

}
