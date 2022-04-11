import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserRemovesAccountRequest} from '../../../use-cases/UserRemovesAccountRequest.js'
import {UserRemovesAccountUseCase} from '../../../use-cases/UserRemovesAccountUseCase.js'

export class RemoveUserAccount extends DomainRoute<UserRemovesAccountRequest> {
    constructor() {
        super('delete', '/:userId', new UserRemovesAccountUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId,
        }
    }
}
