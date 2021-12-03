import { Token } from './Token.js';


export class AuthorToken extends Token {
    static USER_PREFIX = '@';

    constructor(value: string) {
        super(AuthorToken.removePrefix(value));
    }

    isAuthorUsername(): boolean {
        return true;
    }

    isLabel(): boolean {
        return false;
    }

    private static removePrefix(value: string) {
        return value.replace(AuthorToken.USER_PREFIX, '');
    }

}
