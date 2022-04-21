import {Level} from '../../../src/domain/subscription/Level.js'
import {SubscriptionIdentification} from '../../../src/domain/subscription/SubscriptionIdentification.js'
import {DateEvermind} from '../../../src/domain/shared/value/DateEvermind.js'
import {DateISO} from '../../../src/domain/shared/value/DateISO.js'
import {UserIdentification} from '../../../src/domain/user/UserIdentification.js'
import {CardIdentification} from '../../../src/domain/card/CardIdentification.js'
import {SubscriptionFactory} from '../../../src/domain/subscription/SubscriptionFactory.js'
import {AlwaysAuthorizedAuthorization} from '../../implementations/AlwaysAuthorizedAuthorization.js'

export class SubscriptionBuilder {
    private id: SubscriptionIdentification
    private userId: UserIdentification

    private cardId: CardIdentification

    private level: Level

    private lastReview: DateEvermind

    constructor() {
        this.userId = UserIdentification.create()
        this.cardId = CardIdentification.create()
        this.id = SubscriptionIdentification.create()
        this.level = Level.LEVEL_0
        this.lastReview = DateEvermind.fromNow()
    }

    setId(id: string) {
        this.id = SubscriptionIdentification.recreate(id)
        return this
    }

    setUserId(id: string) {
        this.userId = UserIdentification.recreate(id)
        return this
    }

    withUserId(id: UserIdentification) {
        this.userId = id
        return this
    }

    setCardId(id: string) {
        this.cardId = CardIdentification.recreate(id)
        return this
    }

    withCardId(id: CardIdentification) {
        this.cardId = id
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
        const subscriptionFactory = new SubscriptionFactory(new AlwaysAuthorizedAuthorization())
        return subscriptionFactory.recreate(
            this.id, this.userId, this.cardId, this.level, this.lastReview)
    }

    buildDto() {
        return this.build().toDto()
    }
}
