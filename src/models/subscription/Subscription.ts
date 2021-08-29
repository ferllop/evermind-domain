import { DateEvermind } from '../../helpers/DateEvermind.js'
import { Entity } from '../Entity.js'
import { DateISO } from '../value/DateISO.js'
import { DayStartTime } from '../value/DayStartTime.js'
import { Hour } from '../value/Hour.js'
import { Identification } from '../value/Identification.js'
import { Level } from './Level.js'

export class Subscription extends Entity {
    private userId: Identification

    private cardId: Identification

    private level: Level

    private lastReview: DateEvermind

    constructor(id: Identification, userId: Identification, cardId: Identification, level: Level, lastReview: DateEvermind) {
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

    static isValid(userId: string, cardId: string, level: number, lastReview: DateISO) {
        return this.isDtoValid(userId, cardId) &&
            Level.isValid(level) &&
            new DateEvermind(lastReview).isNowOrBefore()
    }

    static isDtoValid(userId: string, cardId: string) {
        return Identification.isValid(userId) && Identification.isValid(cardId)
    }

    static create(userId: Identification, cardId: Identification) {
        return new Subscription(userId.merge(cardId), userId, cardId, Level.LEVEL_0, DateEvermind.fromNow())
    }

}

