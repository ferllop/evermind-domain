import { Level } from '../../../src/domain/subscription/Level.js'
import { Subscription } from '../../../src/domain/subscription/Subscription.js'
import { SubscriptionIdentification } from '../../../src/domain/subscription/SubscriptionIdentification.js'
import { DateEvermind } from '../../../src/domain/value/DateEvermind.js'
import { DateISO } from '../../../src/domain/value/DateISO.js'
import { Identification } from '../../../src/domain/value/Identification.js'

export class SubscriptionBuilder {
    private id: SubscriptionIdentification
    private userId: Identification

    private cardId: Identification

    private level: Level

    private lastReview: DateEvermind

    constructor() {
        this.userId = Identification.create()
        this.cardId = Identification.create()
        this.id = new SubscriptionIdentification(this.userId, this.cardId)
        this.level = Level.LEVEL_0
        this.lastReview = DateEvermind.fromNow()
    }

    setId(id: string) {
        this.id = Identification.recreate(id) as SubscriptionIdentification
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
        return Subscription.recreate(this.id, this.userId, this.cardId, this.level, this.lastReview)
    }
}
