export class Token {
    USER_PREFIX = '@';

    /** @type {string} */
    value

    /** @param {string} token */
    constructor(token) {
        this.value = token
    }

    /** @returns {boolean} */
    isAuthorUsername() {
        return this.value.startsWith(this.USER_PREFIX)
    }

    /** @returns {boolean} */
    isLabel() {
        return !this.isAuthorUsername()
    }

    /** @returns {string} */
    toString() {
        return this.value
    }

    /**@returns {string} */
    clean() {
        return this.toString().replace(this.USER_PREFIX, '')
    }
}
