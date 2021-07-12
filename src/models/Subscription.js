import { precondition } from '../lib/preconditions.js'
import { Hour } from './Hour.js'
import { Level } from './Level.js'

export class Subscription {
    /**@type {string} */
    #userID

    /**@type {string} */
    #cardID

    /**@type {Level} */
    #level

    /**@type {Date} */
    #lastReview

    /**@type {Date} */
    #nextReview

    /**
     * 
     * @param {string} userID 
     * @param {string} cardID 
     * @param {Level} level 
     * @param {Date} lastReview 
     * @param {Date} nextReview 
     */
    constructor(userID, cardID, level, lastReview, nextReview) {
        this.#userID = userID
        this.#cardID = cardID
        this.#level = level
        this.#lastReview = lastReview
        this.#nextReview = nextReview
    }

    getUserID() {
        return this.#userID
    }

    getCardID() {
        return this.#cardID
    }

    getLevel() {
        return this.#level
    }

    getLastReview() {
        return this.#lastReview
    }

    getNextReview() {
        return this.#nextReview
    }

    /**
     * @param {number} dayStartTime
     * @returns {boolean} */
    isToReviewToday(dayStartTime) {
        return this.isToReviewInDate(dayStartTime, new Date())
    }

    /**
     * @param {number} dayStartTime 
     * @param {Date} date 
     * @returns {boolean}
     */
    isToReviewInDate(dayStartTime, date) {
        precondition(dayStartTime > -1 && dayStartTime < 24)
        return new Hour(dayStartTime)
            .reclockDate(this.#nextReview).getTime() <= date.getTime()
    }

}

