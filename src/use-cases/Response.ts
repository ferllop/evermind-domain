import {DomainError} from '../domain/errors/DomainError.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {ErrorDto} from './ErrorDto.js'

export class Response<T> {
    error: ErrorDto
    data: T

    constructor(error: DomainError, data: T) {
        this.error = error.toDto()
        this.data = data
    }

    static withDomainError(error: DomainError): Response<null> {
        return new Response(error, null)
    }

    static withError(error: Error): Response<null> {
        const undocumentedDomainError = new DomainError(ErrorType.UNDOCUMENTED, error)
        return this.withDomainError(undocumentedDomainError)
    }

    static OkWithoutData(): Response<null> {
        return new Response(new DomainError(ErrorType.NULL), null)
    }

    static OkWithData<T>(data: T): Response<T> {
        return new Response<T>(new DomainError(ErrorType.NULL), data)
    }

    hasError(error: ErrorType) {
        return this.data === null && this.error.code === error
    }
}
