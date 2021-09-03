import { DateEvermind } from '../../../src/helpers/DateEvermind.js'
import { Level } from '../../../src/models/subscription/Level.js'
import { Subscription } from '../../../src/models/subscription/Subscription.js'
import { DateISO } from '../../../src/models/value/DateISO.js'
import { Identification } from '../../../src/models/value/Identification.js'

export class SubscriptionBuilder {
    private id: Identification
    private userId: Identification

    private cardId: Identification

    private level: Level

    private lastReview: DateEvermind

    constructor() {
        this.id = Identification.create()
        this.userId = Identification.create()
        this.cardId = Identification.create()
        this.level = Level.LEVEL_0
        this.lastReview = DateEvermind.fromNow()
    }

    setId(id: string) {
        this.id = new Identification(id)
        return this
    }

    setUserId(id: string) {
        this.userId = new Identification(id)
        return this
    }

    setCardId(id: string) {
        this.cardId = new Identification(id)
        return this
    }

    setLevel(level: number) {
        this.level = Level.getByOrdinal(level)
        return this
    }

    setLastReview(lastReview: Date) {
        this.lastReview = new DateEvermind(lastReview.toISOString() as DateISO)
        return this
    }

    build() {
        return new Subscription(this.id, this.userId, this.cardId, this.level, this.lastReview)
    }
}
