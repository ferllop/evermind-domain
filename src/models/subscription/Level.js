import { Enum } from '../../helpers/Enum.js'

export class Level extends Enum {
    static LEVEL_0 = new Level(0)
    static LEVEL_1 = new Level(1)
    static LEVEL_2 = new Level(3)
    static LEVEL_3 = new Level(7)
    static LEVEL_4 = new Level(15)
    static LEVEL_5 = new Level(30)
    static LEVEL_6 = new Level(60)
    static LEVEL_7 = new Level(120)

    /**@type {number} */
    #value

    /**@param {number} value */
    constructor(value) {
        super()
        this.#value = value
    }

    /**@returns {number} */
    getValue() {
        return this.#value
    }

    /**@returns {Level} */
    next() {
        if (this.isLast()) {
            return this
        }
        return Level.values()[this.ordinal() + 1]
    }

    /**@returns {Level} */
    previous() {
        if (this.ordinal() == 0) {
            return this
        }
        return Level.values()[this.ordinal() - 1]
    }

}

