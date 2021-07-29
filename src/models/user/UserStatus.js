import { Enum } from '../../helpers/Enum.js'

export class UserStatus extends Enum {
    static #values = []

    static VERIFICATION_EMAIL = new UserStatus()
    static LOGGED_IN = new UserStatus()
    static LOGGED_OUT = new UserStatus()

    constructor() {
        super(UserStatus.#values)
    }

    static getByOrdinal(ordinal) {
        return UserStatus.#values[ordinal]
    }

    static isValid(ordinal) {
        return ordinal < this.#values.length
    }

    static count() {
        return this.#values.length
    }
}
