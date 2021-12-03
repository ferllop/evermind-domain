import { DateEvermind } from '../shared/value/DateEvermind';
import { DateISO } from '../shared/value/DateISO';
import { Identification } from '../shared/value/Identification';
import { AuthenticationStatus } from './AuthenticationStatus';
import { Email } from './Email';
import { Password } from './Password';

export class Authentication {
    constructor(
        private id: Identification,
        private email: Email,
        private password: Password,
        private status: AuthenticationStatus,
        private lastLogin: DateEvermind,
        private lastConnection: DateEvermind,
        private signedIn: DateEvermind,
    ) { }

    static isValid(id: string, email: string, status: number, lastLogin: DateISO, lastConnection: DateISO, signedIn: DateISO) {
        const lastLoginDate = new DateEvermind(lastLogin)
        const lastConnectionDate = new DateEvermind(lastConnection)
        return Identification.isValid(id) &&
            Email.isValid(email) &&
            AuthenticationStatus.isValid(status) &&
            lastLoginDate.isSameOrBefore(lastConnectionDate) &&
            lastConnectionDate.isNowOrBefore() &&
            new DateEvermind(signedIn).isSameOrBefore(lastLoginDate)
    }

    getId() {
        return this.id
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

    getLastLogin() {
        return this.lastLogin
    }

    getLastConnection() {
        return this.lastConnection
    }

    getSignedIn() {
        return this.signedIn
    }
}


