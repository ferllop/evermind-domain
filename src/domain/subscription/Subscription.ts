import {CardIdentification} from '../card/CardIdentification.js'
import {Entity} from '../shared/Entity.js'
import {UserIdentification} from '../user/UserIdentification.js'
import {DateEvermind} from '../shared/value/DateEvermind.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {Hour} from '../shared/value/Hour.js'
import {Level} from './Level.js'
import {SubscriptionIdentification} from './SubscriptionIdentification.js'
import {SubscriptionDto} from 'evermind-types'
import {Card} from '../card/Card.js'

export class Subscription extends Entity {
    
    private readonly userId: UserIdentification

    private readonly cardId: CardIdentification

    private readonly level: Level

    private readonly lastReview: DateEvermind

    protected constructor(id: SubscriptionIdentification, userId: UserIdentification, cardId: CardIdentification, level: Level, lastReview: DateEvermind) {
        super(id)
        this.userId = userId
        this.cardId = cardId
        this.level = level
        this.lastReview = lastReview
    }

    getUserId() {
        return this.userId
    }

    getCardId() {
        return this.cardId
    }

    getLevel() {
        return this.level
    }

    getLastReview() {
        return this.lastReview
    }

    getNextReview() {
        return this.level.getNextReviewDate(this.lastReview)
    }

    isToReviewToday(dayStartTime: DayStartTime) {
        return this.isToReviewInDate(dayStartTime, new Date())
    }

    isToReviewInDate(dayStartTime: DayStartTime, date: Date): boolean {
        return new Hour(dayStartTime.getValue())
            .setIntoDate(this.getNextReview()).getTime() <= date.getTime()
    }

    equals(subscription: Subscription) {
        return this.getUserId().equals(subscription.getUserId()) &&
            this.getCardId().equals(subscription.getCardId())
    }

    hasCard(card: Card) {
        return this.cardId.equals(card.getId())
    }

    hasUser(userId: UserIdentification) {
        return this.userId.equals(userId)
    }

    clone() {
        return new Subscription(
            this.getId().clone(),
            this.userId.clone(),
            this.cardId.clone(),
            this.level,
            this.lastReview.clone())
    }

    toDto(): SubscriptionDto {
        return {
            id: this.getId().getValue(),
            userId: this.getUserId().getValue(),
            cardId: this.getCardId().getValue(),
            level: this.getLevel().getOrdinal(),
            lastReview: this.getLastReview().toDtoFormat()
        }
    }

}

