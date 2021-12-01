import { AsyncCardRepository } from '../models/card/AsyncCardRepository.js';
import { CardIdentification } from '../models/card/CardIdentification.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { AsyncSubscriptionRepository } from '../models/subscription/AsyncSubscriptionRepository.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { AsyncUserRepository } from '../models/user/AsyncUserRepository.js';
import { UserIdentification } from '../models/user/UserIdentification.js';
import { Response } from './Response.js';
import { UserUnsubscribesFromCardRequest } from './UserUnsubscribesFromCardRequest.js';

export class AsyncUserUnsubscribesFromCardUseCase {
    async execute(request: UserUnsubscribesFromCardRequest) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = await new AsyncUserRepository().findById(new UserIdentification(request.userId))
        if (user.isNull()) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const card = await new AsyncCardRepository().findById(new CardIdentification(request.cardId))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const subscriptionRepository = new AsyncSubscriptionRepository()
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)
  
        if (!subscription) {
            return Response.withError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
        const error = await subscriptionRepository.delete(subscription)
        return new Response(error.getCode(), null)
    }
}
