import {Request as ExpressRequest} from 'express'
import {Route} from './Route.js'
import {HttpMethod} from '../http/HttpMethod.js'
import {RouteResult} from './RouteResult.js'
import {Request} from '../../../use-cases/Request.js'
import {UseCase} from '../../../use-cases/UseCase.js'

export abstract class DomainRoute<R extends Request> extends Route {

    protected constructor(
        httpMethod: HttpMethod,
        path: string,
        protected useCase: UseCase<Record<string, any>, unknown>) {
        super(httpMethod, path)
    }

    async execute(request: ExpressRequest): Promise<RouteResult> {
        const inputData = this.extractInputDataFromRequest(request)
        const result = await this.useCase.execute(inputData)
        return {
            statusCode: this.getHttpStatusCode(result.error.code),
            data: {
                domain: result
            }
        }
    }

    abstract extractInputDataFromRequest(request: ExpressRequest): R

}