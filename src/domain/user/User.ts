import {Entity} from '../shared/Entity.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'
import {PersonName} from './PersonName.js'
import {Username} from './Username.js'
import {Subscription} from '../subscription/Subscription.js'
import {Card} from '../card/Card.js'
import {UserIdentification} from './UserIdentification.js'
import {UserIsAlreadySubscribedToCardError} from '../errors/UserIsAlreadySubscribedToCardError.js'
import {precondition} from '../../implementations/preconditions.js'
import {NullSubscription} from '../subscription/NullSubscription.js'

export class User extends Entity {

    subscriptions: Subscription[] | null

    protected constructor(private name: PersonName, private username: Username, private dayStartTime: DayStartTime, id: UserIdentification) {
        super(id)
        this.subscriptions = null
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

    hasSubscription(subscription: Subscription) {
        return this.subscriptions !== null &&
            this.subscriptions.some(existingSubscription => existingSubscription.equals(subscription))
    }

    subscribe(subscription: Subscription) {
        precondition(this.subscriptions !== null)
        if (this.hasSubscription(subscription)) {
            throw new UserIsAlreadySubscribedToCardError()
        }
        this.subscriptions = this.subscriptions!.concat(subscription.clone())
        return subscription
    }

    isSubscribedTo(card: Card) {
        return this.subscriptions !== null &&
            this.subscriptions.some(subscription => subscription.hasCard(card))
    }

    unsubscribeFrom(card: Card) {
        return this.getSubscription(card)
    }

    getSubscription(card: Card) {
        if (this.subscriptions === null) {
            return NullSubscription.getInstance()
        }
        const subscription = this.subscriptions.find(subscription =>
            subscription.getCardId().equals(card.getId()))
        return subscription !== undefined
            ? subscription
            : NullSubscription.getInstance()
    }

    getSubscriptionsCount() {
        return this.subscriptions === null ? 0 : this.subscriptions.length
    }

    toDto() {
        return {
            id: this.getId().getId(),
            name: this.getName().toString(),
            username: this.getUsername().toString(),
            dayStartTime: this.getDayStartTime().getValue(),
        }
    }
}
