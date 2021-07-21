import { precondition } from '../../lib/preconditions.js'
import { uuid } from '../../lib/uuid.js'
import { Storable } from '../Storable.js'
import { Storage } from '../Storage.js'

class Table {
    /**@type {Map<string, object>} */
    #rows

    constructor() {
        this.#rows = new Map()
    }

    /**
     * @param {Storable} storable 
     * @returns {Id}
     */
    create(storable) {
        precondition(!storable.hasId())
        const id = uuid()
        this.#rows.set(id, storable.getDto())

        return id
    }

    /**
     * @param {Storable} storable
     * @returns {Storable}
     */
     read(storable) {
        precondition(storable.hasId())
        const data = this.#rows.get(storable.getId())
        if (!data) {
            return null 
        }

        return new Storable(storable.getTable(), data).setId(storable.getId())
    }

    /** 
     * @param {Storable} storable 
     * @returns {boolean}
     */
    update(storable) {
        precondition(storable.hasId())
        if (this.#rows.has(storable.getId())) {
            this.#rows.set(storable.getId(), storable.getDto())
            return true
        }
        return false
    }

    /** 
     * @param {Storable} storable 
     * @returns {boolean}
     */
    delete(storable) {
        precondition(storable.hasId())
        return this.#rows.delete(storable.getId())
    }
}

/**
 * @implements {Storage}
 */
export class MemoryStorage {
    
     /** @type {MemoryStorage} */
     static #instance

     static constructable = false

     static getInstance() {
         if (!MemoryStorage.#instance) {
             MemoryStorage.constructable = true
             MemoryStorage.#instance = new MemoryStorage()
         }
         return MemoryStorage.#instance
     }

    /** @type {Map<string, Table>} */
    #tables

    constructor() {
        precondition(MemoryStorage.constructable)
        this.#tables = new Map()
        MemoryStorage.constructable = false
    }

    /** 
     * @param {Storable} storable
     * @returns {Id}
     */
    create(storable) {
        const table = storable.getTable()
        precondition(!storable.hasId())
        if(!this.#tables.has(table)) {
            this.#tables.set(table, new Table())
        }
        return this.#tables.get(storable.getTable()).create(storable)
    }

    /**
     * @param {Storable} storable
     * @returns {Storable}
     */
    read(storable) {
        const table = storable.getTable()
        precondition(this.hasTable(table))
        return this.#tables.get(storable.getTable()).read(storable)
    }

    /** 
     * @param {Storable} storable
     * @returns {boolean} 
     */
    update(storable) {
        const table = storable.getTable()
        precondition(this.hasTable(table))
        return this.#tables.get(table).update(storable)
    }

    /** 
     * @param {Storable} storable 
     * @returns {boolean}
     */
    delete(storable) {   
        const table = storable.getTable()
        precondition(this.hasTable(table))
        return this.#tables.get(table).delete(storable)
    }

    hasTable(table) {
        return this.#tables.has(table)
    }

    getTables() {
        return this.#tables
    }
}
