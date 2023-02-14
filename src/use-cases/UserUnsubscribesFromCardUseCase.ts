import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {Response} from './Response.js'
import {UserUnsubscribesFromCardRequest} from '../types/requests/UserUnsubscribesFromCardRequest.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserUnsubscribesFromCardUseCase extends WithAuthorizationUseCase<UserUnsubscribesFromCardRequest, null> {

    constructor() {
        super(['userId', 'cardId'])
    }

    protected async internalExecute(request: UserUnsubscribesFromCardRequest) {
        const authorization = await this.getAuthorization()
        const user = await new UserRepository().findById(UserIdentification.recreate(request.userId))
        const cardRepository = new CardRepository(authorization)
        const card = await cardRepository.findById(CardIdentification.recreate(request.cardId))
        const subscriptionRepository = new SubscriptionRepository(authorization)
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = user.subscribedTo(subscriptions).unsubscribeFrom(card, authorization)
        await subscriptionRepository.delete(subscription)
        return Response.OkWithoutData()
    }
}
