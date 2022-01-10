import { CardRepository } from '../domain/card/CardRepository.js';
import { CardIdentification } from '../domain/card/CardIdentification.js';
import { ErrorType } from '../domain/errors/ErrorType.js';
import { SubscriptionRepository } from '../domain/subscription/SubscriptionRepository.js';
import { Subscription } from '../domain/subscription/Subscription.js';
import { UserRepository } from '../domain/user/UserRepository.js';
import { UserIdentification } from '../domain/user/UserIdentification.js';
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

        try {
            await subscriptionRepository.delete(subscription)
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }
    }
}
