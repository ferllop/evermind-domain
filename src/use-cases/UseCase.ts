import {Response} from './Response.js'
import {DomainError} from '../domain/errors/DomainError.js'
import {RequiredRequestFieldIsMissingError} from '../domain/errors/RequiredRequestFieldIsMissingError.js'

type JSON = Record<string, any>

export abstract class UseCase<RequestType extends JSON, ResponseType> {

    constructor(private readonly requiredFields: string[]) {
    }

    private isJsonAValidRequest(request: JSON): request is RequestType {
        const requestFields = Object.keys(request)
        return this.requiredFields.every(requiredField => {
            return requestFields.includes(requiredField)
                && request[requiredField] !== undefined
        })
    }

    async execute(request: JSON) {
        try {
            if (!this.isJsonAValidRequest(request)) {
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

}