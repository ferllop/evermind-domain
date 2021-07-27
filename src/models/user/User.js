import { Email } from '../value/Email.js'
import { Identification } from '../value/Identification.js'
import { UserStatus } from './UserStatus.js'
import { EverDate } from '../../helpers/EverDate.js'

export class User {
    /** @type  {Identification} */
    authID
    
    /** @type  {string} */
    name
    
    /** @type  {string} */
    username
    
    /** @type  {Email} */
    email
    
    /** @type  {UserStatus} */
    status
    
    /** @type  {EverDate} */
    lastLogin
    
    /** @type  {EverDate} */
    lastConnection
    
    /** @type  {EverDate} */
    signedIn

    /** @type  {number} */
    dayStartTime

    constructor(authID, name, username, email, status, lastLogin, lastConnection, signedIn, dayStartTime) {
        this.authID = authID
        this.name = name
        this.username = username
        this.email = email
        this.status = status
        this.lastLogin = lastLogin
        this.lastConnection = lastConnection
        this.signedIn = signedIn
        this.dayStartTime = dayStartTime
    }
    
    /** @returns {Identification} */
    getAuthID() {
        return this.authID
    }

    /** @returns {String} */
    getName() {
        return this.name
    }

    /** @returns {String} */
    getUsername() {
        return this.username
    }

    /** @returns {Email} */
    getEmail() {
        return this.email
    }

    /** @returns {UserStatus} */
    getStatus() {
        return this.status
    }

    /** @returns {EverDate} */
    getLastLogin() {
        return this.lastLogin
    }

    /** @returns {EverDate} */
    getLastConnection() {
        return this.lastConnection
    }

    /** @returns {EverDate} */
    getSignedIn() {
        return this.signedIn
    }

    /** @returns {number} */
    getDayStartTime() {
        return this.dayStartTime
    }

    /**
     * @param {Identification} authID 
     * @param {string} name 
     * @param {string} username 
     * @param {Email} email 
     * @param {UserStatus} status 
     * @param {EverDate} lastLogin 
     * @param {EverDate} lastConnection 
     * @param {EverDate} signedIn 
     * @param {number} dayStartTime 
     * @returns {Boolean}
     */
    static isValid(authID, name, username, email, status, lastLogin, lastConnection, signedIn, dayStartTime) {
        return Identification.isValid(authID) &&
            typeof name === 'string' && name.length > 0 &&
            typeof username === 'string' && username.length > 0 &&
            Email.isValid(email) &&
            status instanceof UserStatus &&
            lastLogin.isNowOrBefore() &&
            lastConnection.isSameOrAfter(lastLogin) &&
            signedIn.isSameOrBefore(lastLogin)
    }
}
