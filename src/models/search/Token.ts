export class Token {
    static EMPTY = new Token('')

    USER_PREFIX = '@';

    value: string

    constructor(token: string) {
        this.value = token
    }

    isAuthorUsername(): boolean {
        return this.value.startsWith(this.USER_PREFIX)
    }

    isLabel(): boolean {
        return !this.isAuthorUsername()
    }

    toString(): string {
        return this.value
    }

    clean(): string {
        return this.toString().replace(this.USER_PREFIX, '')
    }
}
