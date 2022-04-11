import {Request as ExpressRequest} from 'express'
import {DomainRoute} from './DomainRoute.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {UserCreatesCardRequest} from '../../../use-cases/UserCreatesCardRequest.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'
import {UserCreatesCardUseCase} from '../../../use-cases/UserCreatesCardUseCase.js'

export class CreateCard extends DomainRoute<UserCreatesCardRequest> {
    constructor() {
        super('post', '/', new UserCreatesCardUseCase())
        this.setHttpStatusCode(DomainErrorCode.NO_ERROR, HttpStatusCode.CREATED)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return request.body as UserCreatesCardRequest
    }
}
