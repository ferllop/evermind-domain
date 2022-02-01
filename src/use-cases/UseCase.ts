import {Response} from './Response.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {DomainError} from '../domain/errors/DomainError.js'

export abstract class UseCase<RequestType, ResponseType> {
    private isRequestValid(request: RequestType): boolean {
        const requestFields = Object.keys(request)
        return this.getRequiredRequestFields().every(requiredField => requestFields.includes(requiredField))
    }

    async execute(request: RequestType) {
        try {
            if (!this.isRequestValid(request)) {
                return Response.withError(new DomainError(ErrorType.REQUIRED_REQUEST_FIELD_IS_MISSING))
            }
            return await this.internalExecute(request)
        } catch (error) {
            return Response.withError(error)
        }
    }

    protected abstract internalExecute(request: RequestType): Promise<Response<ResponseType>>

    protected abstract getRequiredRequestFields(): string[]
}