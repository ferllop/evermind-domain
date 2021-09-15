import { CardIdentification } from '../models/card/CardIdentification.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { SubscriptionRepository } from '../models/subscription/SubscriptionRepository.js';
import { UserIdentification } from '../models/user/UserIdentification.js';
import { UserRepository } from '../models/user/UserRepository.js';
import { Response } from './Response.js';
import { UserUnsubscribesFromCardRequest } from './UserUnsubscribesFromCardRequest.js';

export class UserUnsubscribesFromCardUseCase {
    execute(request: UserUnsubscribesFromCardRequest) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = new UserRepository().retrieve(new UserIdentification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const card = new CardRepository().retrieve(new CardIdentification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const subscriptionRepository = new SubscriptionRepository()
        const subscriptions = subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)

        if (!subscription) {
            return Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
        const error = subscriptionRepository.delete(subscription)
        return new Response(error.getCode(), null)
    }
}
