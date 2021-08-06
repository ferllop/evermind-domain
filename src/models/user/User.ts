import { Email } from '../value/Email.js'
import { Identification } from '../value/Identification.js'
import { UserStatus } from './UserStatus.js'
import { DateEvermind } from '../../helpers/DateEvermind.js'
import { DateISO } from '../value/DateISO'
import { Entity } from '../Entity.js'
import { DayStartTime } from '../value/DayStartTime.js'

export class User extends Entity {

    private authId: Identification
    private name: string
    private username: string
    private email: Email
    private status: UserStatus
    private lastLogin: DateEvermind
    private lastConnection: DateEvermind
    private signedIn: DateEvermind
    private dayStartTime: DayStartTime

    constructor(authId: Identification, name: string, username: string, email: Email, status: UserStatus, lastLogin: DateEvermind, lastConnection: DateEvermind, signedIn: DateEvermind, dayStartTime: DayStartTime, id: Identification) {
        super(id)
        this.authId = authId
        this.name = name
        this.username = username
        this.email = email
        this.status = status
        this.lastLogin = lastLogin
        this.lastConnection = lastConnection
        this.signedIn = signedIn
        this.dayStartTime = dayStartTime
    }

    getAuthId() {
        return this.authId
    }

    getName() {
        return this.name
    }

    getUsername() {
        return this.username
    }

    getEmail() {
        return this.email
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

    getDayStartTime() {
        return this.dayStartTime
    }

    static isValid(authId: string, name: string, username: string, email: string, status: number, lastLogin: DateISO, lastConnection: DateISO, signedIn: DateISO, dayStartTime: number, id?: string): boolean {
        const lastLoginDate = new DateEvermind(lastLogin)
        const lastConnectionDate = new DateEvermind(lastConnection)
        return Identification.isValid(authId) &&
            typeof name === 'string' && name.length > 0 &&
            typeof username === 'string' && username.length > 0 &&
            Email.isValid(email) &&
            UserStatus.isValid(status) &&
            lastLoginDate.isSameOrBefore(lastConnectionDate) &&
            lastConnectionDate.isNowOrBefore() &&
            new DateEvermind(signedIn).isSameOrBefore(lastLoginDate) &&
            DayStartTime.isValid(dayStartTime) &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }
}
