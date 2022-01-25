import { Token } from './Token.js'


export class LabelToken extends Token {

    isAuthorUsername(): boolean {
        return false;
    }

    isLabel(): boolean {
        return true;
    }
}
