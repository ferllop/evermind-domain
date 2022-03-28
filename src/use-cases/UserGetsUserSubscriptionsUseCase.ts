import {Response} from './Response.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UserGetsUserSubscriptionsRequest} from './UserGetsUserSubscriptionsRequest.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {SubscriptionDto} from '../domain/subscription/SusbcriptionDto.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserGetsUserSubscriptionsUseCase extends WithAuthorizationUseCase<UserGetsUserSubscriptionsRequest, SubscriptionDto[]>{

    constructor() {
        super(['userId'])
    }

    protected async internalExecute(request: UserGetsUserSubscriptionsRequest) {
        const user = await new UserRepository().findById(UserIdentification.recreate(request.userId))
        const subscriptions = await new SubscriptionRepository().getByUserId(user, await this.getRequesterPermissions())
        return Response.OkWithData(subscriptions.map(subscription => subscription.toDto()))
    }
}
