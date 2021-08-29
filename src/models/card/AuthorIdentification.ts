import { Identification } from '../value/Identification.js';

export class AuthorIdentification extends Identification {

    constructor(id: string) {
        super(id)
    }

    clone(): AuthorIdentification {
        return new AuthorIdentification(this.getId())
    }
}
