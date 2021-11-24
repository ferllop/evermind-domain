import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserSubscribesToCardRequest } from './UserSubscribesToCardRequest.js';

export class UserSubscribesToCardUseCase {
    execute(request: UserSubscribesToCardRequest) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = new UserRepository().findById(new Identification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        
        const card = new CardRepository().findById(new Identification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }
        
        const subscriptionRepository = new SubscriptionRepository() 
        const subscriptions = subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if(!subscription) {
            return Response.withError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        const error = subscriptionRepository.add(subscription)
        
        return new Response(error.getCode(), null)
    }
}
