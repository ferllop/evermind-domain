import { AuthorToken } from './AuthorToken.js';
import { LabelToken } from './LabelToken.js';
import { NullToken } from "./NullToken.js";


export class TokenFactory {

    static getToken(value?: string) {
        if (typeof (value) === 'undefined' || value.length === 0) {
            return new NullToken();
        }

        if (TokenFactory.isAuthor(value)) {
            return new AuthorToken(value);
        }

        return new LabelToken(value);
    }

    private static isAuthor(value: string) {
        return value.startsWith(AuthorToken.USER_PREFIX);
    }

}
