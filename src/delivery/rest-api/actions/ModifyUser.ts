import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserModifiesUserDataRequest} from '../../../use-cases/UserModifiesUserDataRequest.js'
import {UserModifiesUserDataUseCase} from '../../../use-cases/UserModifiesUserDataUseCase.js'

export class ModifyUser extends DomainAction<UserModifiesUserDataRequest> {
    protected readonly HTTP_METHOD = 'put'
    protected readonly PATH = '/:id'

    constructor() {
        super(new UserModifiesUserDataUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.NO_CONTENT)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            ...request.body,
            id: request.params.id,
        }
    }
}
