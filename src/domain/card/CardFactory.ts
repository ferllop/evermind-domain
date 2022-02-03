import {precondition} from '../../implementations/preconditions.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {Card} from './Card.js'
import {CardDto} from './CardDto.js'
import {Labelling} from './Labelling.js'
import {WrittenAnswer} from './WrittenAnswer.js'
import {WrittenQuestion} from './WrittenQuestion.js'
import {Validator} from '../shared/Validator.js'
import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {CardIdentification} from './CardIdentification.js'
import {Label} from './Label.js'
import {Question} from './Question.js'
import {Answer} from './Answer.js'
import {Identification} from '../shared/value/Identification.js'
import {EntityFactory} from '../shared/EntityFactory.js'

export class CardFactory extends EntityFactory<Card, CardDto> {
    private cardConstructor = Card.prototype.constructor as { new(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: CardIdentification): Card}

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
            this.isValid(
                dto.authorID,
                dto.question,
                dto.answer,
                dto.labelling,
                'id' in dto ? dto.id : undefined
            )
    }

    isValid(authorID: string, question: string, answer: string, labels: string[], id?: string) {
        return Identification.isValid(authorID) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.isValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }

    fromDto(dto: CardDto): Card {
        precondition(this.isDtoValid(dto))
        return this.recreate(new AuthorIdentification(dto.authorID), new WrittenQuestion(dto.question), new WrittenAnswer(dto.answer), new Labelling(dto.labelling.map(labelStr => new Label(labelStr))), new CardIdentification(dto.id))
    }

    fromDtoArray(dtoArray: CardDto[]): Card[] {
        return dtoArray.map(cardDto => this.fromDto(cardDto))
    }

    create(userId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling){
        return new this.cardConstructor(userId, question, answer, labels, Identification.create())
    }

    recreate(authorID: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: Identification){
        return new this.cardConstructor(authorID, question, answer, labels, id)
    }

    apply(card: Card, data: Omit<Partial<CardDto>, 'id'>) {
        const modifiedCard = { ...card.toDto(), ...data}
        return this.fromDto(modifiedCard)
    }

}
