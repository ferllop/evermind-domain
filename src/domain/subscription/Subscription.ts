import {CardIdentification} from '../card/CardIdentification.js'
import {Entity} from '../shared/Entity.js'
import {UserIdentification} from '../user/UserIdentification.js'
import {DateEvermind} from '../shared/value/DateEvermind.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {Hour} from '../shared/value/Hour.js'
import {Level} from './Level.js'
import {SubscriptionIdentification} from './SubscriptionIdentification.js'
import {SubscriptionDto} from './SusbcriptionDto'

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

    getUserID() {
        return this.userId
    }

    getCardID() {
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
        return this.getUserID().equals(subscription.getUserID()) &&
            this.getCardID().equals(subscription.getCardID())
    }

    toDto(): SubscriptionDto {
        return {
            id: this.getId().getId(),
            userId: this.getUserID().getId(),
            cardId: this.getCardID().getId(),
            level: this.getLevel().getOrdinal(),
            lastReview: this.getLastReview().toDtoFormat()
        }
    }

}

