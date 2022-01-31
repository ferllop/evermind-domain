import {Response} from './Response.js'
import {ErrorType} from '../domain/errors/ErrorType.js'

export abstract class UseCase<RequestType, ResponseType> {
    private isRequestValid(request: RequestType): boolean {
        const requestFields = Object.keys(request)
        return this.getRequiredRequestFields().every(requiredField => requestFields.includes(requiredField))
    }

    async execute(request: RequestType) {
        if (!this.isRequestValid(request)) {
            return Response.withError(ErrorType.REQUEST_FIELD_NOT_VALID)
        }
        return await this.internalExecute(request)
    }

    protected abstract internalExecute(request: RequestType): Promise<Response<ResponseType>>

    protected abstract getRequiredRequestFields(): string[]
}