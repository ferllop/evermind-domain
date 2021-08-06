import { precondition } from '../../lib/preconditions.js'
import { Hour } from '../value/Hour.js'
import { Level } from './Level.js'

export class Subscription {
    private userID: string

    private cardID: string

    private level: Level

    private lastReview: Date

    private nextReview: Date

    constructor(userID: string, cardID: string, level: Level, lastReview: Date, nextReview: Date) {
        this.userID = userID
        this.cardID = cardID
        this.level = level
        this.lastReview = lastReview
        this.nextReview = nextReview
    }

    getUserID() {
        return this.userID
    }

    getCardID() {
        return this.cardID
    }

    getLevel() {
        return this.level
    }

    getLastReview() {
        return this.lastReview
    }

    getNextReview() {
        return this.nextReview
    }

    isToReviewToday(dayStartTime: number) {
        return this.isToReviewInDate(dayStartTime, new Date())
    }

    isToReviewInDate(dayStartTime: number, date: Date): boolean {
        precondition(dayStartTime > -1 && dayStartTime < 24)
        return new Hour(dayStartTime)
            .reclockDate(this.nextReview).getTime() <= date.getTime()
    }

}

