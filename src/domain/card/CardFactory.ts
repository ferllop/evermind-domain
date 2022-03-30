import {AuthorIdentification} from './AuthorIdentification.js'
import {Card} from './Card.js'
import {CardDto} from './CardDto.js'
import {Labelling} from './Labelling.js'
import {WrittenAnswer} from './WrittenAnswer.js'
import {WrittenQuestion} from './WrittenQuestion.js'
import {Validator} from '../shared/Validator.js'
import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {CardIdentification} from './CardIdentification.js'
import {Question} from './Question.js'
import {Answer} from './Answer.js'
import {Identification} from '../shared/value/Identification.js'
import {EntityFactory} from '../shared/EntityFactory.js'
import {InputDataNotValidError} from '../errors/InputDataNotValidError.js'
import {Unidentified} from '../shared/value/Unidentified.js'
import {User} from '../user/User.js'
import {CreateCard} from '../authorization/permission/permissions/CreateCard.js'
import {GetCard} from '../authorization/permission/permissions/GetCard.js'
import {NullCard} from './NullCard.js'
import {UpdateCard} from '../authorization/permission/permissions/UpdateCard.js'
import {TransferCard} from '../authorization/permission/permissions/TransferCard.js'
import {Authorization} from '../authorization/Authorization.js'
import {Visibility} from './Visibility.js'

export class CardFactory extends EntityFactory<Card, CardDto> {
    private cardConstructor = Card.prototype.constructor as { new(authorId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, visibility: Visibility, id: CardIdentification): Card }

    constructor(private authorization: Authorization){
        super()
    }

    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', CardIdentification.isValid)
            .set('answer', WrittenAnswer.isValid)
            .set('question', WrittenQuestion.isValid)
            .set('labelling', Labelling.isValid)
            .set('authorId', AuthorIdentification.isValid)
    }

    isDtoValid(dto: MayBeIdentified<CardDto>): boolean {
        return Boolean(dto) &&
            this.isValid(
                dto.authorId,
                dto.question,
                dto.answer,
                dto.labelling,
                'id' in dto ? dto.id : undefined,
            )
    }

    isValid(authorId: string, question: string, answer: string, labels: string[], id?: string) {
        return Identification.isValid(authorId) &&
            WrittenQuestion.isValid(question) &&
            WrittenAnswer.isValid(answer) &&
            Labelling.isValid(labels) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }

    fromDto(dto: MayBeIdentified<CardDto>): Card {
        if (!this.isDtoValid(dto)) {
            throw new InputDataNotValidError()
        }
        if ('id' in dto) {
            return this.recreateFromDto(dto)
        }
        return this.createFromDto(dto)
    }

    createFromDto(dto: Unidentified<CardDto>): Card {
        if (!this.isDtoValid(dto)) {
            throw new InputDataNotValidError()
        }
        return this.create(
            new AuthorIdentification(dto.authorId),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            Labelling.fromStringLabels(dto.labelling),
            dto.visibility,
        )
    }

    recreateFromDto(dto: CardDto) {
        if (!this.isDtoValid(dto)) {
            throw new InputDataNotValidError()
        }
        return this.recreate(
            new AuthorIdentification(dto.authorId),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            Labelling.fromStringLabels(dto.labelling),
            dto.visibility,
            new CardIdentification(dto.id),
        )
    }

    recreateFromDtos(dtoArray: CardDto[]): Card[] {
        return dtoArray.map(cardDto => this.recreateFromDto(cardDto))
    }

    create(userId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, visibility: Visibility) {
        const card = new this.cardConstructor(userId, question, answer, labels, visibility, Identification.create())
        this.authorization.assertCan(CreateCard, card)
        return card
    }

    recreate(authorId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, visibility: Visibility, id: Identification) {
        const card = new this.cardConstructor(authorId, question, answer, labels, visibility, id)
        return this.authorization.can(GetCard, card)
            ? card
            : NullCard.getInstance()
    }

    apply(card: Card, data: Unidentified<Partial<Omit<CardDto, 'authorId'>>>) {
        this.authorization.assertCan(UpdateCard, card)
        const modifiedCard = {
            ...card.toDto(),
            ...data
        }
        return this.fromDto(modifiedCard)
    }

    transferCardToUser(card: Card, user: User) {
    this.authorization.assertCan(TransferCard, card)
        return card.transferTo(user)
    }
}
