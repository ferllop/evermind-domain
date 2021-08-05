import { Email } from '../value/Email.js'
import { Identification } from '../value/Identification.js'
import { UserStatus } from './UserStatus.js'
import { DateEvermind } from '../../helpers/DateEvermind.js'
import { DateISO } from '../value/DateISO'
import { Entity } from '../Entity.js'

export class User extends Entity {
    
    private authId: Identification
    private name: string
    private username: string
    private email: Email
    private status: UserStatus
    private lastLogin: DateEvermind
    private lastConnection: DateEvermind
    private signedIn:DateEvermind
    private dayStartTime: number

    constructor(authId: string, name: string, username: string, email: string, status: number, lastLogin: DateISO, lastConnection: DateISO, signedIn: DateISO, dayStartTime: number, id?: string) {
        super(id)
        this.authId = new Identification(authId)
        this.name = name
        this.username = username
        this.email = new Email(email)
        this.status = UserStatus.getByOrdinal(status)
        this.lastLogin = new DateEvermind(lastLogin)
        this.lastConnection = new DateEvermind(lastConnection)
        this.signedIn = new DateEvermind(signedIn)
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
            dayStartTime >= 0 && dayStartTime <= 23 &&
            (Boolean(id) ? Identification.isValid(id) : true)
    }
}
