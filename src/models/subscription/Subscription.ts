import { DateEvermind } from '../../helpers/DateEvermind.js'
import { CardIdentification } from '../card/CardIdentification.js'
import { Entity } from '../Entity.js'
import { UserIdentification } from '../user/UserIdentification.js'
import { DateISO } from '../value/DateISO.js'
import { DayStartTime } from '../value/DayStartTime.js'
import { Hour } from '../value/Hour.js'
import { Identification } from '../value/Identification.js'
import { Level } from './Level.js'
import { SubscriptionIdentification } from './SubscriptionIdentification.js'

export class Subscription extends Entity {
    static NULL = new Subscription(new SubscriptionIdentification(Identification.NULL, Identification.NULL), Identification.NULL, Identification.NULL, new Level(0), new DateEvermind(new Date().toISOString() as DateISO))
    
    private userId: Identification

    private cardId: Identification

    private level: Level

    private lastReview: DateEvermind

    private constructor(id: SubscriptionIdentification, userId: Identification, cardId: Identification, level: Level, lastReview: DateEvermind) {
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
            .reclockDate(this.getNextReview()).getTime() <= date.getTime()
    }

    equals(subscription: Subscription) {
        return this.getUserID().equals(subscription.getUserID()) &&
            this.getCardID().equals(subscription.getCardID())
    }

    getNull() {
        return Subscription.NULL
    }

    static isValid(userId: string, cardId: string, level: number, lastReview: DateISO) {
        return this.isDtoValid(userId, cardId) &&
            Level.isValid(level) &&
            new DateEvermind(lastReview).isNowOrBefore()
    }

    static isDtoValid(userId: string, cardId: string) {
        return Identification.isValid(userId) && Identification.isValid(cardId)
    }

    static create(userId: UserIdentification, cardId: CardIdentification) {
        const id  = new SubscriptionIdentification(userId, cardId)
        return new Subscription(id, userId, cardId, Level.LEVEL_0, DateEvermind.fromNow())
    }

    static recreate(id: SubscriptionIdentification, userId: UserIdentification, cardId: CardIdentification, level: Level, lastReview: DateEvermind) {
        return new Subscription(id, userId, cardId, level, lastReview)
    }

}

