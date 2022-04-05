import {Request as ExpressRequest} from 'express'
import {Action} from './Action.js'
import {HttpMethod} from '../http/HttpMethod.js'
import {ActionResult} from './ActionResult.js'
import {Request} from '../../../use-cases/Request.js'
import {UseCase} from '../../../use-cases/UseCase.js'

export abstract class DomainAction<R extends Request> extends Action {

    protected abstract override readonly HTTP_METHOD: HttpMethod

    protected constructor(protected useCase: UseCase<Record<string, any>, unknown>) {
        super()
    }

    async execute(request: ExpressRequest): Promise<ActionResult> {
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