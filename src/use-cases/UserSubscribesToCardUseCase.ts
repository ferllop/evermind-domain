import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { Identification } from '../models/value/Identification.js';
import { Datastore } from '../models/Datastore.js';
import { UserSubscribesToCardRequest } from './UserSubscribesToCardRequest.js';
import { Response } from './Response.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';

export class UserSubscribesToCardUseCase {
    execute(request: UserSubscribesToCardRequest, datastore: Datastore) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = new UserRepository(datastore).retrieve(new Identification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        
        const card = new CardRepository(datastore).retrieve(new Identification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }
        
        const subscriptionRepository = new SubscriptionRepository(datastore) 
        const subscriptions = subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if(!subscription) {
            return Response.withError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        const error = subscriptionRepository.store(subscription)
        
        return new Response(error.getCode(), null)
    }
}
