import { ErrorType } from './ErrorType.js'

export class DomainError extends Error {
    /** @type {ErrorType} */
    #type

    /** @param {ErrorType} errorType */
    constructor(errorType){
        super()
        this.#type = errorType
    }

    getType() {
        return this.#type
    }
}
