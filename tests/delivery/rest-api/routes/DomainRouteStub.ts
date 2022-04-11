import {Request as ExpressRequest} from 'express'
import {DomainRoute} from '../../../../src/delivery/rest-api/routes/DomainRoute.js'
import {UseCase, Request} from '../../../../src/index.js'

export class DomainRouteStub extends DomainRoute<Request> {
    constructor(useCase: UseCase<Request, unknown>) {
        super('get', '/:name', useCase)
    }

    extractInputDataFromRequest(request: ExpressRequest) {
        return {
            name: request.params.name,
        }
    }
}