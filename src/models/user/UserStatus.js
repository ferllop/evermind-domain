import { Enum } from '../../helpers/Enum.js'

export class UserStatus extends Enum {
    /** @type {UserStatus[]} */
    static #values = []

    static VERIFICATION_EMAIL = new UserStatus()
    static LOGGED_IN = new UserStatus()
    static LOGGED_OUT = new UserStatus()

    constructor() {
        super(UserStatus.#values)
    }

    /**
     * @param {number} ordinal 
     * @returns {UserStatus}
     */
    static getByOrdinal(ordinal) {
        return UserStatus.#values[ordinal]
    }

    /**
     * @param {number} ordinal 
     * @returns {boolean}
     */
    static isValid(ordinal) {
        return ordinal < this.#values.length
    }

    /**
     * @returns {number}
     */
    static count() {
        return this.#values.length
    }
}
