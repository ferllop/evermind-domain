import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {UserSubscribesToCardUseCase} from '../../../use-cases/UserSubscribesToCardUseCase.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserSubscribesToCardRequest} from '../../../use-cases/UserSubscribesToCardRequest.js'

export class SubscribeToCard extends DomainRoute<UserSubscribesToCardRequest> {
    constructor() {
        super('post', '/:userId/cards/:cardId', new UserSubscribesToCardUseCase())
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
