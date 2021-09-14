import { DomainError } from '../errors/DomainError.js';
import { ErrorType } from '../errors/ErrorType.js';
import { Identification } from '../models/value/Identification.js';
import { Datastore } from '../models/Datastore.js'
import { CardRepository } from '../models/card/CardRepository.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';
import { UserRepository } from '../models/user/UserRepository.js';

export class SubscriptionController {

    subscribeUserToCard(userId: Identification, cardId: Identification, datastore: Datastore): DomainError {
        const user = new UserRepository(datastore).findOne(user => userId.equalsString(user.id))
        if (user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        
        const card = new CardRepository(datastore).retrieve(cardId)
        if (card.isNull()) {
            return new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        
        const subscriptionRepository = new SubscriptionRepository(datastore) 
        const subscriptions = subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if(!subscription) {
            return new DomainError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        return subscriptionRepository.store(subscription)
        
    }
    
    unsubscribeUserToCard(userId: Identification, cardId: Identification, datastore: Datastore): DomainError {
        const user = new UserRepository(datastore).findOne(user => userId.equalsString(user.id))
        if (user.isNull()) {
            return new DomainError(ErrorType.USER_NOT_FOUND)
        }
        
        const card = new CardRepository(datastore).retrieve(cardId)
        if (card.isNull()) {
            return new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        
        const subscriptionRepository = new SubscriptionRepository(datastore) 
        const subscriptions = subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)
        
        if (!subscription) {
            return new DomainError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
        return subscriptionRepository.delete(subscription)
    }
}
