import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {UserGetsUserInfoUseCase} from '../../../use-cases/UserGetsUserInfoUseCase.js'
import {UserGetsUserInfoRequest} from '../../../use-cases/UserGetsUserInfoRequest.js'

export class GetUser extends DomainRoute<UserGetsUserInfoRequest> {
    constructor() {
        super('get', '/:userId', new UserGetsUserInfoUseCase())
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId
        }
    }
}
