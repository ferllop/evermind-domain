import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRepository} from '../domain/user/UserRepository.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {UserNotFoundError} from '../domain/errors/UserNotFoundError.js'
import {UserGetsUserSubscriptionsRequest} from './UserGetsUserSubscriptionsRequest.js'
import {SubscriptionRepository} from '../domain/subscription/SubscriptionRepository.js'
import {SubscriptionDto} from '../domain/subscription/SusbcriptionDto.js'

export class UserGetsUserSubscriptionsUseCase extends UseCase<UserGetsUserSubscriptionsRequest, SubscriptionDto[]>{

    constructor() {
        super(['userId'])
    }

    protected async internalExecute(request: UserGetsUserSubscriptionsRequest) {
        if(!Identification.isValid(request.userId)) {
            throw new InputDataNotValidError()
        }
        
        const user = await new UserRepository().findById(new Identification(request.userId))
        
        if (user.isNull()) {
            throw new UserNotFoundError()
        }

        const subscriptions = await new SubscriptionRepository().findByUserId(user)

        return Response.OkWithData(subscriptions.map(subscription => subscription.toDto()))
    }
}
