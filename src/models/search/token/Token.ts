export abstract class Token {

    constructor(protected value: string) { }

    getValue() {
        return this.value
    }

    isNull() {
        return this.value.length === 0
    }

    equals(token: Token) {
        return this.value === token.value
    }
    
    toString(): string {
        return this.getValue()
    }

    abstract isAuthorUsername(): boolean
    abstract isLabel(): boolean

}
