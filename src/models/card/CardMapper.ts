import { precondition } from '../../lib/preconditions.js'
import { AuthorIdentification } from '../../models/card/AuthorIdentification.js'
import { Card } from '../../models/card/Card.js'
import { CardDto } from '../../models/card/CardDto.js'
import { Labelling } from '../../models/card/Labelling.js'
import { WrittenAnswer } from '../../models/card/WrittenAnswer.js'
import { WrittenQuestion } from '../../models/card/WrittenQuestion.js'
import { Mapper } from '../Mapper'
import { MayBeIdentified } from '../value/MayBeIdentified'
import { CardIdentification } from './CardIdentification.js'
import { Label } from './Label.js'

export class CardMapper implements Mapper<Card, CardDto> {
    validators: Map<string, any>
    constructor() {
        this.validators = new Map<string, any>()
        this.validators.set('id', CardIdentification.isValid)
        this.validators.set('answer', WrittenAnswer.isValid)
        this.validators.set('question', WrittenQuestion.isValid)
        this.validators.set('labelling', Labelling.isValid)
        this.validators.set('authorID', AuthorIdentification.isValid)
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

    arePropertiesValid(card: Partial<CardDto>) {
        return Object.entries(card).every(
            ([key, value]) => this.isPropertyValid(key, value))
    }

    isPropertyValid(key: string, value: any): boolean {
        return this.validators.get(key)(value)
    }
}
