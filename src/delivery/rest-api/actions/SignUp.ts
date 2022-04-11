import {Request as ExpressRequest} from 'express'
import {DomainAction} from './DomainAction.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserSignsUpUseCase} from '../../../use-cases/UserSignsUpUseCase.js'
import {UserSignsUpRequest} from '../../../use-cases/UserSignsUpRequest.js'

export class SignUp extends DomainAction<UserSignsUpRequest> {
    constructor() {
        super('post', '/', new UserSignsUpUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.CREATED)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return request.body
    }
}
