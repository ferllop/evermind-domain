import {UserIdentification} from './UserIdentification.js'
import {UserNotFoundError} from '../errors/UserNotFoundError.js'
import {StoredUser} from './StoredUser.js'
import {User} from './User.js'
import {PersonName} from './PersonName.js'
import {Username} from './Username.js'
import {DayStartTime} from '../shared/value/DayStartTime.js'

const NullUser = new class extends User {
    constructor(){
        super(
            PersonName.NULL,
            Username.NULL,
            new DayStartTime(9),
        )}
}()

export class NullStoredUser extends StoredUser {
    private static instance: NullStoredUser | null = null

    private constructor() {
        super(NullUser, UserIdentification.NULL)
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new NullStoredUser()
        }
        return this.instance
    }

    override getId(): UserIdentification {
        if (this.isNull()) {
            throw new UserNotFoundError()
        }
        return super.getId()
    }

    override isNull(): boolean {
        return true
    }
}