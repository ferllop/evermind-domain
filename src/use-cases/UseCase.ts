import {Response} from './Response.js'
import {DomainError} from '../domain/errors/DomainError.js'
import {RequiredRequestFieldIsMissingError} from '../domain/errors/RequiredRequestFieldIsMissingError.js'
import {Request} from '../types/requests/Request.js'

export abstract class UseCase<RequestType extends Request, ResponseType> {
    readonly requiredFields: string[]
    constructor(requiredFields: string[]) {
        this.requiredFields = requiredFields
    }

    private getMissingFields(request: RequestType): string[] {
        const result: string[] = []
        this.requiredFields.forEach(requiredField => {
            if (request[requiredField] === undefined) {
                result.push(requiredField)
            }
        })
        return result
    }

    private isJsonAValidRequest(request: RequestType): request is RequestType {
        return this.getMissingFields(request).length === 0
    }

    async execute(request: RequestType) {
        try {
            if (!this.isJsonAValidRequest(request)) {
                return Response.withDomainError(new RequiredRequestFieldIsMissingError(this.getMissingFields(request)))
            }

            return await this.internalExecute(request)
        } catch (error) {
            if (error instanceof DomainError) {
                return Response.withDomainError(error)
            } else {
                return Response.withError(error as Error)
            }
        }
    }

    protected abstract internalExecute(request: RequestType): Promise<Response<ResponseType>>

}

