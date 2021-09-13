import { UserIdentification } from '../user/UserIdentification.js'

export class AuthorIdentification extends UserIdentification {

    clone(): AuthorIdentification {
        return new AuthorIdentification(this.getId())
    }
    
}
