import {HttpMethod} from '../http/HttpMethod.js'
import {StatusCodeMapper} from '../http/StatusCodeMapper.js'
import {Request as ExpressRequest} from 'express'
import {ActionResult} from './ActionResult.js'
import {Router} from '../routers/Router.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'

export abstract class Action {
    protected abstract readonly PATH: string
    protected abstract readonly HTTP_METHOD: HttpMethod
    private statusCodeMapper: StatusCodeMapper = new StatusCodeMapper()

    register(router: Router) {
        router[this.HTTP_METHOD](this.PATH, this)
    }

    getHttpStatusCode(domainErrorCode: DomainErrorCode){
        return this.statusCodeMapper.getHttpStatusCode(domainErrorCode)
    }

    setHttpStatusCode(domainErrorCode: DomainErrorCode, httpStatusCode: HttpStatusCode){
        return this.statusCodeMapper.setHttpStatusCode(domainErrorCode, httpStatusCode)
    }

    abstract execute(request: ExpressRequest): Promise<ActionResult>

}