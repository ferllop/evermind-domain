import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserUnsubscribesFromCardUseCase} from '../../../use-cases/UserUnsubscribesFromCardUseCase.js'
import {UserUnsubscribesFromCardRequest} from '../../../use-cases/UserUnsubscribesFromCardRequest.js'

export class UnsubscribeToCard extends DomainRoute<UserUnsubscribesFromCardRequest> {
    constructor() {
        super('delete', '/:userId/cards/:cardId', new UserUnsubscribesFromCardUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId,
            cardId: request.params.cardId,
        }
    }
}

