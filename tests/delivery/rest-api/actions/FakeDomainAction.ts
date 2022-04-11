import {Request as ExpressRequest} from 'express'
import {DomainAction} from '../../../../src/delivery/rest-api/actions/DomainAction.js'
import {UseCase, Request} from '../../../../src/index.js'

export class FakeDomainAction extends DomainAction<Request> {
    constructor(useCase: UseCase<Request, unknown>) {
        super('get', '/:name', useCase)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            name: request.params.name,
        }
    }
}