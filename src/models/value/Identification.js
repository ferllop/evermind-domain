import { precondition } from '../../lib/preconditions.js'
import { uuid } from '../../lib/uuid.js'

export class Identification {
    /** @type {string} */
    #value

    /**
     * @param {string} [value]
     */
    constructor(value) {
        precondition(value ? Identification.isValid(value) : true)
        this.#value = value ?? uuid()
    }

    /**
     * @returns {string}
     */
    toString() {
        return this.#value
    }

    /**
     * @param {any} data 
     * @returns {boolean}
     */
    static isValid(data) {
        return typeof data === 'string' && data.length > 0
    }
}

