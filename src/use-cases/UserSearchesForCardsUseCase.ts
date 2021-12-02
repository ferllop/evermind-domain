import { CardDto } from '../models/card/CardDto.js';
import { CardMapper } from '../models/card/CardMapper.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { SearchService } from '../models/search/SearchService.js';
import { Response } from './Response.js';
import { UserSearchesForCardsRequest } from './UserSearchesForCardsRequest.js';

export class UserSearchesForCardsUseCase {
    async execute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const cards = await new SearchService().executeQuery(request)
        const mapper = new CardMapper()
        return new Response(ErrorType.NULL, cards.map(card => mapper.toDto(card)))
    }
}
