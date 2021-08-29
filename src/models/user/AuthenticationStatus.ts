import { Enum } from '../../helpers/Enum.js'

export class AuthenticationStatus extends Enum {
    private static values: AuthenticationStatus[] = []

    static VERIFICATION_EMAIL = new AuthenticationStatus()
    static LOGGED_IN = new AuthenticationStatus()
    static LOGGED_OUT = new AuthenticationStatus()

    constructor() {
        super(AuthenticationStatus.values)
    }

    static getByOrdinal(ordinal: number) {
        return AuthenticationStatus.values[ordinal]
    }

    static isValid(ordinal: number) {
        return ordinal < this.values.length
    }

    static count() {
        return this.values.length
    }
}
