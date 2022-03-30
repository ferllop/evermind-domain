import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {Response} from './Response.js'
import {UserUnsubscribesFromCardRequest} from './UserUnsubscribesFromCardRequest.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'
import {UserAuthorization} from '../domain/authorization/permission/UserAuthorization.js'

export class UserUnsubscribesFromCardUseCase extends UseCase<UserUnsubscribesFromCardRequest, null> {

    constructor() {
        super(['userId', 'cardId'])
    }

    protected async internalExecute(request: UserUnsubscribesFromCardRequest) {
        if (!(Identification.isValid(request.userId) && Identification.isValid(request.cardId))) {
            throw new InputDataNotValidError()
        }

        const user = await new UserRepository().findById(new UserIdentification(request.userId))
        if (user.isNull()) {
            throw new UserNotFoundError()
        }
        const cardRepository = new CardRepository(UserAuthorization.ANONYMOUS)
        const card = await cardRepository.findById(new CardIdentification(request.cardId))
        if (card.isNull()) {
            throw new CardNotFoundError()
        }
        const subscriptionRepository = new SubscriptionRepository(UserAuthorization.ANONYMOUS)
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card)
        await subscriptionRepository.delete(subscription)

        return Response.OkWithoutData()
    }
}
