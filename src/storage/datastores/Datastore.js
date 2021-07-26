import '../../models/value/Identification.js'

/** @interface */
export class Datastore {

    /** 
     * @param {string} table
     * @param {object} json
     * @returns {Boolean}
     */
    create(table, json) {
        throw new Error("create must be implemented in a child class")
    }

    /**
     * @param {string} table
     * @param {string} id
     * @returns {object|null}
     */
    read(table, id) {
        throw new Error("read must be implemented in a child class")
    }

    /**
     * @param {string} table
     * @param {object} json
     * @returns {boolean}
     */
    update(table, json) {
        throw new Error("update must be implemented in a child class")
    }

    /** 
     * @param {string} table
     * @param {string} id
     * @returns {boolean}
     */
    delete(table, id) {
        throw new Error("delete must be implemented in a child class")
    }

    /** 
     * @param {string} table
     * @returns {boolean}
     */
     hasTable(table) {
        throw new Error("hasTable must be implemented in a child class")
    }
}
