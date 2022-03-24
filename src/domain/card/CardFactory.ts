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
import {UpdateCard} from '../authorization/permission/permissions/UpdateCard.js'
import {Authorization} from '../authorization/Authorization.js'
import {CreateCard} from '../authorization/permission/permissions/CreateCard.js'
import {User} from '../user/User.js'
import {TransferCard} from '../authorization/permission/permissions/TransferCard.js'
import {UserPermissions} from '../authorization/UserPermissions.js'

export class CardFactory extends EntityFactory<Card, CardDto> {
    private cardConstructor = Card.prototype.constructor as { new(authorId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: CardIdentification): Card }

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
            return this.recreate(
                new AuthorIdentification(dto.authorId),
                new WrittenQuestion(dto.question),
                new WrittenAnswer(dto.answer),
                Labelling.fromStringLabels(dto.labelling),
                new CardIdentification(dto.id))
        }
        return this.create(
            new AuthorIdentification(dto.authorId),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            Labelling.fromStringLabels(dto.labelling),
        )
    }

    createFromDto(dto: Unidentified<CardDto>, userPermissions: UserPermissions): Card {
        if (!this.isDtoValid(dto)) {
            throw new InputDataNotValidError()
        }
        const card = this.create(
            new AuthorIdentification(dto.authorId),
            new WrittenQuestion(dto.question),
            new WrittenAnswer(dto.answer),
            Labelling.fromStringLabels(dto.labelling),
        )
        Authorization.assertUserWithPermissions(userPermissions).can(CreateCard, card)
        return card
    }

    fromDtos(dtoArray: CardDto[]): Card[] {
        return dtoArray.map(cardDto => this.fromDto(cardDto))
    }

    create(userId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling) {
        return new this.cardConstructor(userId, question, answer, labels, Identification.create())
    }

    recreate(authorId: AuthorIdentification, question: Question, answer: Answer, labels: Labelling, id: Identification) {
        return new this.cardConstructor(authorId, question, answer, labels, id)
    }

    apply(card: Card, data: Unidentified<Partial<Omit<CardDto, 'authorId'>>>, userPermissions: UserPermissions) {
        Authorization.assertUserWithPermissions(userPermissions).can(UpdateCard, card)
        const modifiedCard = {
            ...card.toDto(),
            ...data
        }
        return new CardFactory().fromDto(modifiedCard)
    }

    transferCardToUser(card: Card, user: User, userPermissions: UserPermissions) {
        Authorization.assertUserWithPermissions(userPermissions).can(TransferCard, card)
        return this.recreate(
            user.getId().clone(),
            card.getQuestion().clone(),
            card.getAnswer().clone(),
            card.getLabelling().clone(),
            card.getId().clone())

    }
}
