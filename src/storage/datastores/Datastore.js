import { Storable } from '../storables/Storable.js'
import '../../models/value/Id.js'

/** @interface */
export class Datastore {

    /** 
     * @param {Storable} storable
     * @returns {Id}
     */
    create(storable) {
        throw new Error("create must be implemented in a child class")
    }

    /**
     * @param {Storable} storable
     * @returns {Storable}
     */
    read(storable) {
        throw new Error("read must be implemented in a child class")
    }

    /** 
     * @param {Storable} storable
     * @returns {boolean}
     */
    update(storable) {
        throw new Error("update must be implemented in a child class")
    }

    /** 
     * @param {Storable} storable
     * @returns {boolean}
     */
    delete(storable) {
        throw new Error("delete must be implemented in a child class")
    }
}


