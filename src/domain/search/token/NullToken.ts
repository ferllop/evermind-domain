import { Token } from './Token.js';


export class NullToken extends Token {
    constructor() {
        super('');
    }

    isAuthorUsername(): boolean {
        return false;
    }

    isLabel(): boolean {
        return false;
    }
}
