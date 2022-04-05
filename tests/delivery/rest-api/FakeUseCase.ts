import {Response, UseCase} from '../../../src/index.js'

export type UseCaseRequest = {
    name: string,
}

export class FakeUseCase extends UseCase<UseCaseRequest, { name: string } | null> {
    error?: Error

    constructor() {
        super([])

    }

    protected override async internalExecute(request: UseCaseRequest) {
        if (this.error) {
            throw this.error
        }
        return Response.OkWithData({name: request.name})
    }

    withError(error: Error) {
        this.error = error
        return this
    }
}