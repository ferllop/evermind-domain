export class Enum {

    
    /**@type {number} */
    #ordinal

    constructor(values) {
        this.#ordinal = values.length
        values.push(this)
    }

    /**@returns {number} */
    ordinal() {
        return this.#ordinal
    }
}
