import {MayBeIdentified} from '../shared/value/MayBeIdentified.js'
import {Level} from './Level.js'
import {Subscription} from './Subscription.js'
import {SubscriptionDto} from './SusbcriptionDto.js'
import {SubscriptionIdentification} from './SubscriptionIdentification.js'
import {Validator} from '../shared/Validator.js'
import {UserIdentification} from '../user/UserIdentification.js'
import {CardIdentification} from '../card/CardIdentification.js'
import {DateEvermind} from '../shared/value/DateEvermind.js'
import {EntityFactory} from '../shared/EntityFactory.js'
import {DateISO} from '../shared/value/DateISO.js'
import {Identification} from '../shared/value/Identification.js'

export class SubscriptionFactory extends EntityFactory<Subscription, SubscriptionDto> {

    private subscriptionConstructor = Subscription.prototype.constructor as {
        new(id: SubscriptionIdentification,
            userId: UserIdentification,
            cardId: CardIdentification,
            level: Level,
            lastReview: DateEvermind
        ): Subscription}

    getValidators(): Map<string, Validator> {
        return new Map()
            .set('id', SubscriptionIdentification.isValid)
            .set('userId', UserIdentification.isValid)
            .set('cardId', CardIdentification.isValid)
            .set('level', Level.isValid)
            .set('lastReview', DateEvermind.isISOString)
    }
    
    isDtoValid(dto: MayBeIdentified<SubscriptionDto>): boolean {
        return new SubscriptionFactory().isValid(dto.userId, dto.cardId, dto.level, dto.lastReview)
    }

    fromDto(dto: SubscriptionDto): Subscription {
        const userId = new UserIdentification(dto.userId)
        const cardId = new CardIdentification(dto.cardId)
        const subscriptionId = new SubscriptionIdentification(dto.id)
        return new SubscriptionFactory().recreate(subscriptionId, userId, cardId, Level.getByOrdinal(dto.level), new DateEvermind(dto.lastReview))
    }

    isValid(userId: string, cardId: string, level: number, lastReview: DateISO) {
        return Identification.isValid(userId) &&
            Identification.isValid(cardId) &&
            Level.isValid(level) &&
            new DateEvermind(lastReview).isNowOrBefore()
    }

    create(userId: UserIdentification, cardId: CardIdentification) {
        const id  = SubscriptionIdentification.create()
        return new this.subscriptionConstructor(id, userId, cardId, Level.LEVEL_0, DateEvermind.fromNow())
    }

    recreate(id: SubscriptionIdentification, userId: UserIdentification, cardId: CardIdentification, level: Level, lastReview: DateEvermind) {
        return new this.subscriptionConstructor(id, userId, cardId, level, lastReview)
    }
}
