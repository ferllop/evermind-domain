import { DayStartTime } from '../shared/value/DayStartTime.js'
import { PersonName } from './PersonName.js'
import { Username } from './Username.js'
import { User } from './User.js'
import { UserIdentification } from './UserIdentification.js'
import {UserNotFoundError} from '../errors/UserNotFoundError.js'

export class NullUser extends User {
    private static instance = null

    private constructor() {
        super(
            PersonName.NULL,
            Username.NULL,
            new DayStartTime(9),
            UserIdentification.NULL
        )
    }

    static getInstance() {
        return this.instance ?? new NullUser()
    }

    override getId() {
        if (this.isNull()) {
            throw new UserNotFoundError()
        }
        return super.getId()
    }

    override isNull() {
        return true
    }

}
