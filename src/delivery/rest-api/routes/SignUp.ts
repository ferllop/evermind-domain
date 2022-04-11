import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserSignsUpUseCase} from '../../../use-cases/UserSignsUpUseCase.js'
import {UserSignsUpRequest} from '../../../use-cases/UserSignsUpRequest.js'

export class SignUp extends DomainRoute<UserSignsUpRequest> {
    constructor() {
        super('post', '/', new UserSignsUpUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.CREATED)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return request.body
    }
}
