import { DomainError } from '../domain/errors/DomainError.js'
import { ErrorType } from '../domain/errors/ErrorType.js'
import { ErrorDto } from './ErrorDto.js'

export class Response<T> {
    error: ErrorDto
    data: T

    constructor(error: ErrorType, data: T) {
        const domainError = new DomainError(error)
        this.error = {code: domainError.getCode(), message: domainError.message}
        this.data = data
    }

    static withError(error: ErrorType): Response<null> {
        return new Response(error, null)
    }

    static OkWithoutData(): Response<null> {
        return new Response(ErrorType.NULL, null)
    }

    static OkWithData<T>(data: T): Response<T> {
        return new Response<T>(ErrorType.NULL, data)
    }

    hasError(error: ErrorType) {
        return this.data === null && this.error.code === error
    }
}
