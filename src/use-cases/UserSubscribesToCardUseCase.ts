import {CardRepository} from '../domain/card/CardRepository.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserSubscribesToCardRequest} from './UserSubscribesToCardRequest.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserSubscribesToCardUseCase extends UseCase<UserSubscribesToCardRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['userId', 'cardId']
    }

    protected async internalExecute(request: UserSubscribesToCardRequest) {
        if (!(Identification.isValid(request.userId) && Identification.isValid(request.cardId))) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = await new UserRepository().findById(new Identification(request.userId))
        if (user.isNull()) {
            throw new DomainError(ErrorType.USER_NOT_FOUND)
        }
        const card = await new CardRepository().findById(new Identification(request.cardId))
        if (card.isNull()) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        const subscriptionRepository = new SubscriptionRepository()
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if (!subscription) {
            throw new DomainError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
        }
        await subscriptionRepository.add(subscription)

        return Response.OkWithoutData()
    }
}
