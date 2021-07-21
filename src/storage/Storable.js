import { precondition } from '../lib/preconditions.js'

export class Storable { 

    /** @type {Id} */
    #id

    /** @type {string} */
    #table

    /** @type {object} */
    #dto
    
    /**
     * @param {string} table 
     * @param {object} dto 
     */
    constructor(table, dto, id) {
        this.#table = table
        this.#dto = dto

    }

    /** @returns {string} */
    getId() {
        return this.#id
    }

    /** @returns {string} */
    getTable() {
        return this.#table
    }

    /** @returns {object} */
    getDto() {
        return this.#dto
    }

    /** 
     * @param {Id} id
     * @returns {Storable} 
     */
     setId(id) {
        precondition(!this.hasId())
        if (! this.hasId()) {
            this.#id = id
        }
        return this
    }

    
    /** @returns {boolean} */
    hasId() {
        return Boolean(this.#id)
    }
        
}
