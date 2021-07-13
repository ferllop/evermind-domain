import { precondition } from '../lib/preconditions.js'
import { Labelling } from './Labelling.js'
import { Token } from './Token.js'

export class Search {
    /** @type {Token[]} */
    #tokens

    /** @param {string} query */
    constructor(query){
        precondition(Boolean(query))
        this.#tokens = this.#extractTokens(query.toLowerCase())
    }

    /**
     * @param {string} query
     * @returns {Token[]} 
     */
    #extractTokens(query){
        return this.#parseQuery(query).map(queryPart => new Token(queryPart))
    }

    /**
     * @param {string} query
     * @returns {string[]}
     */
    #parseQuery(query){
        return query.trim().split(Labelling.LABEL_LIST_SEPARATOR)
    }

    /** @returns {Token} */
    #getFirstAuthorUsernameToken(){
        return this.#tokens.find(token => token.isAuthorUsername())
    }

    /** @returns {Token[]} */
    #getLabelTokens(){
        return this.#tokens.filter(token => token.isLabel())
    }

    /** @returns {string[]} */
    getLabels(){
        return this.#getLabelTokens().map(token => token.toString())
    }

    /** @returns {String} */
    getAuthorUsername(){
        return this.#getFirstAuthorUsernameToken().clean()
    }

    /** @returns {boolean} */
    hasLabels(){
        return this.getLabels().length > 0
    }

    /** @returns {boolean} */
    hasAuthor(){
        return Boolean(this.#getFirstAuthorUsernameToken())
    }
}
