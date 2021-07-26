import { precondition } from '../../lib/preconditions.js'
import { Datastore } from './Datastore.js'

class Table {
    /**@type {Map<string, object>} */
    #rows

    constructor() {
        this.#rows = new Map()
    }

    /**
     * @param {object} dto 
     * @returns {Boolean}
     */
    create(dto) {
        precondition(dto.id)
        const previousSize = this.#rows.size
        this.#rows.set(dto.id, dto)
        return this.#rows.size === previousSize + 1
    }

    /**
     * @param {string} id
     * @returns {object|null}
     */
    read(id) {
        precondition(Boolean(id))
        const data = this.#rows.get(id)
        return data ?? null
    }

    /** 
     * @param {object} dto 
     * @returns {boolean}
     */
    update(dto) {
        precondition(dto.id)
        if (!this.#rows.has(dto.id)) {
            return false
        }
        const preupdateData = this.read(dto.id)
        this.#rows.set(dto.id, { ...preupdateData, ...dto })
        return true
    }

    /** 
     * @param {string} id 
     * @returns {boolean}
     */
    delete(id) {
        return this.#rows.delete(id)
    }
}

/**
 * @implements {Datastore}
 */
export class InMemoryDatastore {

    /** @type {InMemoryDatastore} */
    static #instance

    static constructable = false

    static getInstance() {
        if (!InMemoryDatastore.#instance) {
            InMemoryDatastore.constructable = true
            InMemoryDatastore.#instance = new InMemoryDatastore()
        }
        return InMemoryDatastore.#instance
    }

    /** @type {Map<string, Table>} */
    #tables

    constructor() {
        precondition(InMemoryDatastore.constructable)
        this.#tables = new Map()
        InMemoryDatastore.constructable = false
    }

    /** 
     * @param {string} table
     * @param {object} dto
     * @returns {Boolean}
     */
    create(table, dto) {
        precondition(dto.id)
        if (!this.#tables.has(table)) {
            this.#tables.set(table, new Table())
        }
        return this.#tables.get(table).create(dto)
    }

    /**
     * @param {string} table
     * @param {string} id
     * @returns {object|null}
     */
    read(table, id) {
        precondition(this.hasTable(table))
        return this.#tables.get(table).read(id)
    }

    /** 
     * @param {string} table
     * @param {object} dto
     * @returns {boolean} 
     */
    update(table, dto) {
        precondition(this.hasTable(table))
        return this.#tables.get(table).update(dto)
    }

    /** 
     * @param {string} table 
     * @param {string} id 
     * @returns {boolean}
     */
    delete(table, id) {
        precondition(this.hasTable(table) && Boolean(id))
        return this.#tables.get(table).delete(id)
    }

    hasTable(table) {
        return this.#tables.has(table)
    }

    clean() {
        this.#tables = new Map()
    }

}
