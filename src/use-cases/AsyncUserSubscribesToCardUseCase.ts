import { AsyncCardRepository } from '../models/card/AsyncCardRepository.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { AsyncSubscriptionRepository } from '../models/subscription/AsyncSubscriptionRepository.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';
import { AsyncUserRepository } from '../models/user/AsyncUserRepository.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserSubscribesToCardRequest } from './UserSubscribesToCardRequest.js';

export class AsyncUserSubscribesToCardUseCase {
    async execute(request: UserSubscribesToCardRequest) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = await new AsyncUserRepository().findById(new Identification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }
        
        const card = await new AsyncCardRepository().findById(new Identification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }
        
        const subscriptionRepository = new AsyncSubscriptionRepository() 
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if(!subscription) {
            return Response.withError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        const error = await subscriptionRepository.add(subscription)
        
        return new Response(error.getCode(), null)
    }
}
