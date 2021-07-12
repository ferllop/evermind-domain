export class Enum {

    /**@type {number} */
    #ordinal

    /**@type {any[]} */
    static #values = [];

    constructor() {
        this.#ordinal = Enum.#values.length
        Enum.#values.push(this)
    }

    /**@returns {number} */
    ordinal() {
        return this.#ordinal
    }

    /**@returns {boolean} */
    isLast() {
        return this.ordinal() == Enum.values().length - 1
    }

    /**@returns {any[]} */
    static values() {
        return Enum.#values
    }
}
