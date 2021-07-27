import { Enum } from '../../helpers/Enum.js'

export class UserStatus extends Enum {
    static #values = []

    VERIFICATION_EMAIL = new UserStatus()
    LOGGED_IN = new UserStatus()
    LOGGED_OUT = new UserStatus()

    constructor() {
        super(UserStatus.#values)
    }

    static getByOrdinal(ordinal) {
        return UserStatus.#values[ordinal]
    }
}
