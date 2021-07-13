import { Enum } from '../../helpers/Enum.js'

export class UserStatus extends Enum {
    VERIFICATION_EMAIL = new UserStatus()
    LOGGED_IN = new UserStatus()
    LOGGED_OUT = new UserStatus()
}
