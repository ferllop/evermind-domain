import { ErrorType } from '../../errors/ErrorType.js'

export class Response {
    /** @type {ErrorType} */
    error

    /** @type {object} */
    data

    /**
     * @param {ErrorType} error 
     * @param {object} data 
     */
    constructor(error, data) {
        this.error = error
        this.data = data
    }

    /**
     * @param {ErrorType} error
     * @returns {Response}
     */
    static withError(error) {
        return {...new Response(error, null)}
    }

    /**
     * @returns {Response}
     */
    static OkWithoutData() {
        return {...new Response(null, null)}
    }

    /**
     * @param {object} data 
     * @returns {Response}
     */
    static OkWithData(data) {
        return {...new Response(null, data)}
    }
}
