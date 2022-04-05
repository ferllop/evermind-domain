import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {UserSubscribesToCardUseCase} from '../../../use-cases/UserSubscribesToCardUseCase.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserSubscribesToCardRequest} from '../../../use-cases/UserSubscribesToCardRequest.js'

export class SubscribeToCard extends DomainAction<UserSubscribesToCardRequest> {
    protected readonly HTTP_METHOD = 'post'
    protected readonly PATH = '/:userId/cards/:cardId'

    constructor() {
        super(new UserSubscribesToCardUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.CREATED)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            userId: request.params.userId,
            cardId: request.params.cardId,
        }
    }
}
