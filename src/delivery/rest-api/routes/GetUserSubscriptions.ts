import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {UserGetsUserSubscriptionsRequest} from '../../../use-cases/UserGetsUserSubscriptionsRequest.js'
import {UserGetsUserSubscriptionsUseCase} from '../../../use-cases/UserGetsUserSubscriptionsUseCase.js'

export class GetUserSubscriptions extends DomainRoute<UserGetsUserSubscriptionsRequest> {
    constructor() {
        super('get', '/:userId/subscriptions',  new UserGetsUserSubscriptionsUseCase())
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId,
        }
    }
}
