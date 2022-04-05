import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserUnsubscribesFromCardUseCase} from '../../../use-cases/UserUnsubscribesFromCardUseCase.js'
import {UserUnsubscribesFromCardRequest} from '../../../use-cases/UserUnsubscribesFromCardRequest.js'

export class UnsubscribeToCard extends DomainAction<UserUnsubscribesFromCardRequest> {
    protected readonly HTTP_METHOD = 'delete'
    protected readonly PATH = '/:userId/cards/:cardId'

    constructor() {
        super(new UserUnsubscribesFromCardUseCase())
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

