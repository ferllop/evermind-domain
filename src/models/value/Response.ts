import { ErrorType } from '../../errors/ErrorType.js'

export class Response<T> {
    error: ErrorType | null
    data: T

    constructor(error: ErrorType | null, data: T) {
        this.error = error === ErrorType.NULL ? null : error
        this.data = data
    }

    static withError(error: ErrorType): Response<null> {
        return new Response(error, null)
    }

    static OkWithoutData(): Response<null> {
        return new Response(null, null)
    }

    static OkWithData<T>(data: T): Response<T> {
        return new Response<T>(null, data)
    }
}
