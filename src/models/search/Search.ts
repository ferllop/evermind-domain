import { precondition } from '../../lib/preconditions.js'
import { Labelling } from '../card/Labelling.js'
import { Token } from './Token.js'

export class Search {
    private tokens: Token[]

    constructor(query: string){
        precondition(Boolean(query))
        this.tokens = this.extractTokens(query.toLowerCase())
    }

    private extractTokens(query: string): Token[] {
        return this.parseQuery(query).map((queryPart: string) => new Token(queryPart))
    }

    private parseQuery(query: string): string[] {
        return query.trim().split(Labelling.LABEL_LIST_SEPARATOR)
    }

    private getFirstAuthorUsernameToken(): Token {
        return this.tokens.find(token => token.isAuthorUsername()) || Token.EMPTY
    }

    private getLabelTokens(): Token[] {
        return this.tokens.filter(token => token.isLabel())
    }

    getLabels(): string[] {
        return this.getLabelTokens().map(token => token.toString())
    }

    getAuthorUsername(): string {
        return this.getFirstAuthorUsernameToken().clean()
    }

    hasLabels(): boolean {
        return this.getLabels().length > 0
    }

    hasAuthor(): boolean {
        return this.getFirstAuthorUsernameToken() !== Token.EMPTY
    }
}
