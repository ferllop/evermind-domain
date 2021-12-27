import { UserIdentification } from '../user/UserIdentification.js'

export class AuthorIdentification extends UserIdentification {

    static override create() {
        return super.create() as AuthorIdentification
    }

    clone(): AuthorIdentification {
        return new AuthorIdentification(this.getId())
    }
    
}
