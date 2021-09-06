import { UserIdentification } from '../user/UserIdentification.js'

export class AuthorIdentification extends UserIdentification {

    constructor(id: string) {
        super(id)
    }

    clone(): AuthorIdentification {
        return new AuthorIdentification(this.getId())
    }
}
