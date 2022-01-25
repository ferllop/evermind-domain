import { Token } from './token/Token.js'
import { NullToken } from './token/NullToken.js'
import { TokenFactory } from './token/TokenFactory.js'
import { AuthorToken } from './token/AuthorToken.js'
import { LabelToken } from './token/LabelToken.js'
import { precondition } from '../../implementations/preconditions.js'

export class Search {
    static TOKEN_LIST_SEPARATOR = ','

    private tokens: Token[]

    constructor(query: string){
        precondition(Boolean(query))
        this.tokens = this.extractTokens(query.toLowerCase())
    }

    private extractTokens(query: string): Token[] {
        return this.parseQuery(query).map((queryPart: string) => TokenFactory.getToken(queryPart))
    }

    private parseQuery(query: string): string[] {
        return query.trim().replace(/\s/g, '').split(Search.TOKEN_LIST_SEPARATOR)
    }

    getAuthorUsername(): AuthorToken {
        return this.tokens.find(token => token.isAuthorUsername()) || new NullToken()
    }

    getLabels(): LabelToken[] {
        return this.tokens.filter(token => token.isLabel())
    }

    hasLabels(): boolean {
        return this.getLabels().length > 0
    }

    hasAuthor(): boolean {
        return this.getAuthorUsername().isAuthorUsername()
    }
}
