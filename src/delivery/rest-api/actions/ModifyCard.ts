import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserModifiesCardDataUseCase} from '../../../use-cases/UserModifiesCardDataUseCase.js'
import {UserModifiesCardDataRequest} from '../../../use-cases/UserModifiesCardDataRequest.js'

export class ModifyCard extends DomainAction<UserModifiesCardDataRequest> {
    constructor() {
        super('put', '/:id', new UserModifiesCardDataUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            ...request.body,
            id: request.params.id,
        }
    }
}
