import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {UserGetsUserInfoUseCase} from '../../../use-cases/UserGetsUserInfoUseCase.js'
import {UserGetsUserInfoRequest} from '../../../use-cases/UserGetsUserInfoRequest.js'

export class GetUser extends DomainAction<UserGetsUserInfoRequest> {
    protected readonly HTTP_METHOD = 'get'
    protected readonly PATH = '/:userId'

    constructor() {
        super(new UserGetsUserInfoUseCase())
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId
        }
    }
}
