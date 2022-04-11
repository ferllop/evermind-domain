import {HttpMethod} from '../http/HttpMethod.js'
import {StatusCodeMapper} from '../http/StatusCodeMapper.js'
import {Request as ExpressRequest} from 'express'
import {RouteResult} from './RouteResult.js'
import {Router} from '../routers/Router.js'
import {HttpStatusCode} from '../http/HttpStatusCode.js'
import {DomainErrorCode} from '../../../domain/errors/DomainErrorCode.js'

export abstract class Route {
    private statusCodeMapper: StatusCodeMapper = new StatusCodeMapper()

    protected constructor(
        protected readonly httpMethod: HttpMethod,
        protected readonly path: string) {
    }

    register(router: Router) {
        router[this.httpMethod](this.path, this)
    }

    getHttpStatusCode(domainErrorCode: DomainErrorCode){
        return this.statusCodeMapper.getHttpStatusCode(domainErrorCode)
    }

    setHttpStatusCode(domainErrorCode: DomainErrorCode, httpStatusCode: HttpStatusCode){
        return this.statusCodeMapper.setHttpStatusCode(domainErrorCode, httpStatusCode)
    }

    abstract execute(request: ExpressRequest): Promise<RouteResult>

}