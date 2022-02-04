import {DomainError} from '../domain/errors/DomainError.js'
import {ErrorDto} from './ErrorDto.js'
import {UndocumentedError} from '../domain/errors/UndocumentedError.js'
import {NullError} from '../domain/errors/NullError.js'

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
        const undocumentedDomainError = new UndocumentedError(error)
        return this.withDomainError(undocumentedDomainError)
    }

    static OkWithoutData(): Response<null> {
        return new Response(new NullError(), null)
    }

    static OkWithData<T>(data: T): Response<T> {
        return new Response<T>(new NullError(), data)
    }

}
