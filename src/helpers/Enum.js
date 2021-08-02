export class Enum {

    
    /**@type {number} */
    #ordinal

    /**
     * @param {any} values 
     */
    constructor(values) {
        this.#ordinal = values.length
        values.push(this)
    }

    /**@returns {number} */
    ordinal() {
        return this.#ordinal
    }
}
