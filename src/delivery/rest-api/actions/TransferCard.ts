import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserTransfersCardUseCase} from '../../../use-cases/UserTransfersCardUseCase.js'
import {UserTransfersCardRequest} from '../../../use-cases/UserTransfersCardRequest.js'

export class TransferCard extends DomainAction<UserTransfersCardRequest> {
    constructor() {
        super('post', '/:cardId/transfer/:userId', new UserTransfersCardUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest): UserTransfersCardRequest {
        return {
            requesterId: request.body.requesterId,
            authorId: request.params.userId,
            cardId: request.params.cardId,
        }
    }
}
