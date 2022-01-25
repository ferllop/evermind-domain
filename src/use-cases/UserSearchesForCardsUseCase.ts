import { CardDto } from '../domain/card/CardDto.js'
import { ErrorType } from '../domain/errors/ErrorType.js'
import { SearchService } from '../domain/search/SearchService.js'
import { Response } from './Response.js'
import { UserSearchesForCardsRequest } from './UserSearchesForCardsRequest.js'

export class UserSearchesForCardsUseCase {
    async execute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const cards = await new SearchService().executeQuery(request)
        return new Response(ErrorType.NULL, cards.map(card => card.toDto()))
    }
}
