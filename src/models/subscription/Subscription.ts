import { DayStartTime } from '../value/DayStartTime.js'
import { Hour } from '../value/Hour.js'
import { Identification } from '../value/Identification.js'
import { Level } from './Level.js'

export class Subscription {
    private userID: Identification

    private cardID: Identification

    private level: Level

    private lastReview: Date

    private nextReview: Date

    constructor(userID: Identification, cardID: Identification, level: Level, lastReview: Date, nextReview: Date) {
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

    isToReviewToday(dayStartTime: DayStartTime) {
        return this.isToReviewInDate(dayStartTime, new Date())
    }

    isToReviewInDate(dayStartTime: DayStartTime, date: Date): boolean {
        return new Hour(dayStartTime.getValue())
            .reclockDate(this.nextReview).getTime() <= date.getTime()
    }

}

