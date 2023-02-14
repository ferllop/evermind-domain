import {CardRepository} from '../domain/card/CardRepository.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {Response} from './Response.js'
import {UserSubscribesToCardRequest} from '../types/requests/UserSubscribesToCardRequest.js'
import {SubscriptionDto} from '../types/dtos/SusbcriptionDto.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {SubscriptionFactory} from '../domain/subscription/SubscriptionFactory.js'

export class UserSubscribesToCardUseCase extends WithAuthorizationUseCase<UserSubscribesToCardRequest, SubscriptionDto> {

    constructor() {
        super(['userId', 'cardId'])
    }

    protected async internalExecute(request: UserSubscribesToCardRequest) {
        const authorization = await this.getAuthorization()
        const user = await new UserRepository().findById(UserIdentification.recreate(request.userId))
        const card = await new CardRepository(authorization)
            .findById(CardIdentification.recreate(request.cardId))
        const subscriptionRepository = new SubscriptionRepository(authorization)
        const subscriptions = await subscriptionRepository.findByUserId(user)
        const subscription = new SubscriptionFactory(authorization).create(user.getId(), card.getId())
        user.subscribedTo(subscriptions).subscribe(subscription)
        await subscriptionRepository.add(subscription)
        return Response.OkWithData(subscription.toDto())
    }
}
