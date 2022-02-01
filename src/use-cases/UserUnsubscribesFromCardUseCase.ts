import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {Response} from './Response.js'
import {UserUnsubscribesFromCardRequest} from './UserUnsubscribesFromCardRequest.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserUnsubscribesFromCardUseCase extends UseCase<UserUnsubscribesFromCardRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['userId', 'cardId']
    }

    protected async internalExecute(request: UserUnsubscribesFromCardRequest) {
        if (!(Identification.isValid(request.userId) && Identification.isValid(request.cardId))) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = await new UserRepository().findById(new UserIdentification(request.userId))
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
        const card = await new CardRepository().findById(new CardIdentification(request.cardId))
        if (card.isNull()) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        const subscriptionRepository = new SubscriptionRepository()
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)
        if (!subscription) {
            throw new DomainError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
        await subscriptionRepository.delete(subscription)

        return Response.OkWithoutData()
    }
}
