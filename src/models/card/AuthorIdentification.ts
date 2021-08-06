import { Identification } from '../value/Identification.js';

export class AuthorIdentification extends Identification {

    constructor(id: Identification | string) {
        super(id.toString())
    }

    clone(): AuthorIdentification {
        return new AuthorIdentification(this)
    }
}
