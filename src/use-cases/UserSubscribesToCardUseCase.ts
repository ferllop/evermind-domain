import {CardRepository} from '../domain/card/CardRepository.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserSubscribesToCardRequest} from './UserSubscribesToCardRequest.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'
import {UserIsAlreadySubscribedToCardError} from '../domain/errors/UserIsAlreadySubscribedToCardError.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'
import {SubscriptionDto} from '../domain/subscription/SusbcriptionDto.js'

export class UserSubscribesToCardUseCase extends UseCase<UserSubscribesToCardRequest, SubscriptionDto> {

    constructor() {
        super(['userId', 'cardId'])
    }

    protected async internalExecute(request: UserSubscribesToCardRequest) {
        if (!(Identification.isValid(request.userId) && Identification.isValid(request.cardId))) {
            throw new InputDataNotValidError()
        }

        const user = await new UserRepository().findById(new Identification(request.userId))
        if (user.isNull()) {
            throw new UserNotFoundError()
        }
        const card = await new CardRepository().findById(new Identification(request.cardId))
        if (card.isNull()) {
            throw new CardNotFoundError()
        }
        const subscriptionRepository = new SubscriptionRepository()
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).subscribeTo(card)
        if (!subscription) {
            throw new UserIsAlreadySubscribedToCardError()
        }
        await subscriptionRepository.add(subscription)

        return Response.OkWithData(subscription.toDto())
    }
}
