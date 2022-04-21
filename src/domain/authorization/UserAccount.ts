import {DateEvermind} from '../shared/value/DateEvermind.js'
import {AuthenticationStatus} from './AuthenticationStatus.js'
import {Email} from '../user/Email.js'
import {Password} from './Password.js'
import {Username} from '../user/Username.js'

export class UserAccount {
    private status: AuthenticationStatus
    private lastConnection: DateEvermind|null
    private signedIn: DateEvermind|null

    constructor(
        private username: Username,
        private email: Email,
        private password: Password,
    ) {
        this.status = AuthenticationStatus.VERIFICATION_EMAIL
        this.lastConnection = null
        this.signedIn = null
    }

    static isValid(username: string, email: string, password: string) {
        return Username.isValid(username) &&
            Email.isValid(email) &&
            Password.isValid(password)
    }

    getUsername() {
        return this.username
    }

    getEmail() {
        return this.email
    }

    getPassword() {
        return this.password
    }

    getStatus() {
        return this.status
    }

    getLastConnection() {
        return this.lastConnection
    }

    getSignedIn() {
        return this.signedIn
    }
}

