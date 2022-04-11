import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserRemovesCardRequest} from '../../../use-cases/UserRemovesCardRequest.js'
import {UserRemovesCardUseCase} from '../../../use-cases/UserRemovesCardUseCase.js'

export class DeleteCard extends DomainAction<UserRemovesCardRequest> {
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
