import { ErrorType } from '../../errors/ErrorType.js'

export class Response {
    /** @type {ErrorType | null} */
    error

    /** @type {object | null} */
    data

    /**
     * @param {ErrorType | null} error 
     * @param {object | null} data 
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
