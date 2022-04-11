import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {UserGetsUserSubscriptionsRequest} from '../../../use-cases/UserGetsUserSubscriptionsRequest.js'
import {UserGetsUserSubscriptionsUseCase} from '../../../use-cases/UserGetsUserSubscriptionsUseCase.js'

export class GetUserSubscriptions extends DomainAction<UserGetsUserSubscriptionsRequest> {
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
