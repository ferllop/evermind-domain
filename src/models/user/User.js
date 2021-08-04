import { Email } from '../value/Email.js'
import { Identification } from '../value/Identification.js'
import { UserStatus } from './UserStatus.js'
import { DateEvermind } from '../../helpers/DateEvermind.js'
import { DateISO } from '../value/DateISO'

export class User {
    
    /** @type  {Identification} */
    #id
    
    /** @type  {Identification} */
    #authId
    
    /** @type  {string} */
    #name
    
    /** @type  {string} */
    #username
    
    /** @type  {Email} */
    #email
    
    /** @type  {UserStatus} */
    #status
    
    /** @type  {DateEvermind} */
    #lastLogin
    
    /** @type  {DateEvermind} */
    #lastConnection
    
    /** @type  {DateEvermind} */
    #signedIn

    /** @type  {number} */
    #dayStartTime

    /**
     * 
     * @param {string} authId 
     * @param {string} name 
     * @param {string} username 
     * @param {string} email 
     * @param {number} status 
     * @param {DateISO} lastLogin 
     * @param {DateISO} lastConnection 
     * @param {DateISO} signedIn 
     * @param {number} dayStartTime 
     * @param {string} id 
     */
    constructor(authId, name, username, email, status, lastLogin, lastConnection, signedIn, dayStartTime, id) {
        this.#authId = new Identification(authId)
        this.#name = name
        this.#username = username
        this.#email = new Email(email)
        this.#status = UserStatus.getByOrdinal(status)
        this.#lastLogin = new DateEvermind(lastLogin)
        this.#lastConnection = new DateEvermind(lastConnection)
        this.#signedIn = new DateEvermind(signedIn)
        this.#dayStartTime = dayStartTime
        this.#id = id ? new Identification(id) : new Identification()
    }
    
    /** @returns {Identification} */
    getAuthId() {
        return this.#authId
    }

    /** @returns {String} */
    getName() {
        return this.#name
    }

    /** @returns {String} */
    getUsername() {
        return this.#username
    }

    /** @returns {Email} */
    getEmail() {
        return this.#email
    }

    /** @returns {UserStatus} */
    getStatus() {
        return this.#status
    }

    /** @returns {DateEvermind} */
    getLastLogin() {
        return this.#lastLogin
    }

    /** @returns {DateEvermind} */
    getLastConnection() {
        return this.#lastConnection
    }

    /** @returns {DateEvermind} */
    getSignedIn() {
        return this.#signedIn
    }

    /** @returns {number} */
    getDayStartTime() {
        return this.#dayStartTime
    }

    /** @returns {Identification} */
    getId() {
        return this.#id
    }

    /**
     * @param {string} authId
     * @param {string} name 
     * @param {string} username 
     * @param {string} email 
     * @param {number} status 
     * @param {string} lastLogin 
     * @param {string} lastConnection 
     * @param {string} signedIn 
     * @param {number} dayStartTime 
     * @param {string} [id] 
     * @returns {Boolean}
     */
    static isValid(authId, name, username, email, status, lastLogin, lastConnection, signedIn, dayStartTime, id) {
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
