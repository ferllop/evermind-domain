import { UserStatus } from './UserStatus.js'

export class User {
    /** @type  {string} */
    authID
    
    /** @type  {string} */
    name
    
    /** @type  {string} */
    username
    
    /** @type  {string} */
    email
    
    /** @type  {UserStatus} */
    status
    
    /** @type  {Date} */
    lastLogin
    
    /** @type  {Date} */
    lastConnection
    
    /** @type  {Date} */
    signIn

    /** @type  {number} */
    dayStartTime

    constructor(authID, name, username, email, status, lastLogin, lastConnection, signIn, dayStartTime) {
        this.authID = authID
        this.name = name
        this.username = username
        this.email = email
        this.status = status
        this.lastLogin = lastLogin
        this.lastConnection = lastConnection
        this.signIn = signIn
        this.dayStartTime = dayStartTime
    }
    
    /** @returns {String} */
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

    /** @returns {String} */
    getEmail() {
        return this.email
    }

    /** @returns {UserStatus} */
    getStatus() {
        return this.status
    }

    /** @returns {Date} */
    getLastLogin() {
        return this.lastLogin
    }

    /** @returns {Date} */
    getLastConnection() {
        return this.lastConnection
    }

    /** @returns {Date} */
    getSignIn() {
        return this.signIn
    }

    /** @returns {number} */
    getDayStartTime() {
        return this.dayStartTime
    }
}
