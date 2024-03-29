import {DayStartTime} from '../shared/value/DayStartTime.js'
import {PersonName} from './PersonName.js'
import {Username} from './Username.js'
import {Subscription} from '../subscription/Subscription.js'
import {Card} from '../card/Card.js'
import {UserIsAlreadySubscribedToCardError} from '../errors/UserIsAlreadySubscribedToCardError.js'
import {precondition} from '../../implementations/preconditions.js'
import {NullSubscription} from '../subscription/NullSubscription.js'
import {Authorization} from '../authorization/Authorization.js'
import {UnsubscribeFromCard} from '../authorization/permission/permissions/UnsubscribeFromCard.js'

export class User {

    subscriptions: Subscription[] | null

    protected constructor(
        private name: PersonName,
        private username: Username,
        private dayStartTime: DayStartTime,
    ) {
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

    unsubscribeFrom(card: Card, authorization: Authorization) {
        const subscription = this.getSubscription(card)
        authorization.assertCan(UnsubscribeFromCard, subscription)
        return this.unsubscribe(subscription)
    }

    private unsubscribe(subscription: Subscription) {
        precondition(this.subscriptions !== null)
        this.subscriptions = this.subscriptions!.filter(
            storedSubscription => !storedSubscription.equals(subscription))
        return subscription
    }

    getSubscription(card: Card) {
        if (this.subscriptions === null) {
            return NullSubscription.getInstance()
        }
        const cardId = card.getId()
        const subscription = this.subscriptions.find(subscription =>
            subscription.getCardId().equals(cardId))
        return subscription !== undefined
            ? subscription
            : NullSubscription.getInstance()
    }

    getSubscriptionsCount() {
        return this.subscriptions === null ? 0 : this.subscriptions.length
    }

    toDto() {
        return {
            name: this.getName().toString(),
            username: this.getUsername().toString(),
            dayStartTime: this.getDayStartTime().getValue(),
        }
    }

}

