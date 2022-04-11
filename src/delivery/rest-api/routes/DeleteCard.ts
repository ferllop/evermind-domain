import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserRemovesCardRequest} from '../../../use-cases/UserRemovesCardRequest.js'
import {UserRemovesCardUseCase} from '../../../use-cases/UserRemovesCardUseCase.js'

export class DeleteCard extends DomainRoute<UserRemovesCardRequest> {
    constructor() {
        super('delete', '/:id', new UserRemovesCardUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            id: request.params.id
        }
    }
}
