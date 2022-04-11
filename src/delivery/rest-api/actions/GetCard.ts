import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {UserReadsACardUseCase} from '../../../use-cases/UserReadsACardUseCase.js'
import {UserReadsACardRequest} from '../../../use-cases/UserReadsACardRequest.js'

export class GetCard extends DomainAction<UserReadsACardRequest> {
    constructor() {
        super('get', '/:cardId', new UserReadsACardUseCase())
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            requesterId: request.body.requesterId,
            cardId: request.params.cardId,
        }
    }
}
