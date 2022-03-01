import {Response} from './Response.js'
import {DomainError} from '../domain/errors/DomainError.js'
import {RequiredRequestFieldIsMissingError} from '../domain/errors/RequiredRequestFieldIsMissingError.js'

export abstract class UseCase<RequestType extends Record<string, any>, ResponseType> {
    private isRequestValid(request: RequestType): boolean {
        const requestFields = Object.keys(request)
        return this.getRequiredRequestFields().every(requiredField => {
            return requestFields.includes(requiredField)
                && request[requiredField] !== undefined
        })
    }

    async execute(request: RequestType) {
        try {
            if (!this.isRequestValid(request)) {
                return Response.withDomainError(new RequiredRequestFieldIsMissingError())
            }
            return await this.internalExecute(request)
        } catch (error) {
            if(error instanceof DomainError){
                return Response.withDomainError(error)
            } else {
                return Response.withError(error as Error)
            }
        }
    }

    protected abstract internalExecute(request: RequestType): Promise<Response<ResponseType>>

    protected abstract getRequiredRequestFields(): string[]
}