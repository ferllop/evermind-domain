import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserModifiesUserDataRequest} from '../../../use-cases/UserModifiesUserDataRequest.js'
import {UserModifiesUserDataUseCase} from '../../../use-cases/UserModifiesUserDataUseCase.js'

export class ModifyUser extends DomainRoute<UserModifiesUserDataRequest> {
    constructor() {
        super('put', '/:id', new UserModifiesUserDataUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            ...request.body,
            id: request.params.id,
        }
    }
}
