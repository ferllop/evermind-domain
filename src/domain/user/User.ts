import {Entity} from '../shared/Entity.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {PersonName} from './PersonName.js'
import {Username} from './Username.js'
import {Subscription} from '../subscription/Subscription.js'
import {Card} from '../card/Card.js'
import {UserIdentification} from './UserIdentification.js'
import {UserDto} from './UserDto.js'
import {UserFactory} from './UserFactory.js'
import {SubscriptionFactory} from '../subscription/SubscriptionFactory.js'

export class User extends Entity {

    subscriptions: Subscription[]

    protected constructor(private name: PersonName, private username: Username, private dayStartTime: DayStartTime, id: UserIdentification) {
        super(id)
        this.subscriptions = []
    }

    getName() {
        return this.name
    }

    getUsername() {
        return this.username
    }

    getDayStartTime() {
        return this.dayStartTime
    }

    subscribedTo(subscriptions: Subscription[]) {
        this.subscriptions = subscriptions
        return this
    }

    subscribeTo(card: Card) {
        if (this.getSubscription(card)) {
            return null
        }
        return new SubscriptionFactory().create(this.getId(), card.getId())
    }

    unsubscribeFrom(card: Card) {
        const subscription = this.getSubscription(card)
        return subscription || null
    }

    getSubscription(card: Card) {
        return this.subscriptions.find(
            subscription => subscription.getCardID().equals(card.getId())
        )
    }

    apply(user: Omit<Partial<UserDto>, 'id'>) {
        const modifiedCard = { ...this.toDto(), ...user }
        return new UserFactory().fromDto(modifiedCard)
    }

    toDto(){
        return {
            id: this.getId().getId(),
            name: this.getName().toString(),
            username: this.getUsername().toString(),
            dayStartTime: this.getDayStartTime().getValue()
        }
    }
}
