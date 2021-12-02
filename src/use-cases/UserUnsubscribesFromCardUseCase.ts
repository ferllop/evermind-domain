import { CardRepository } from '../models/card/CardRepository.js';
import { CardIdentification } from '../models/card/CardIdentification.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { UserIdentification } from '../models/user/UserIdentification.js';
import { Response } from './Response.js';
import { UserUnsubscribesFromCardRequest } from './UserUnsubscribesFromCardRequest.js';

export class UserUnsubscribesFromCardUseCase {
    async execute(request: UserUnsubscribesFromCardRequest) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = await new UserRepository().findById(new UserIdentification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const card = await new CardRepository().findById(new CardIdentification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const subscriptionRepository = new SubscriptionRepository()
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)
  
        if (!subscription) {
            return Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
        const error = await subscriptionRepository.delete(subscription)
        return new Response(error.getCode(), null)
    }
}
