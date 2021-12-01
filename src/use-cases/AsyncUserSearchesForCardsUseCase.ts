import { CardDto } from '../models/card/CardDto.js';
import { CardMapper } from '../models/card/CardMapper.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { AsyncSearchService } from '../models/search/AsyncSearchService.js';
import { Response } from './Response.js';
import { UserSearchesForCardsRequest } from './UserSearchesForCardsRequest.js';

export class AsyncUserSearchesForCardsUseCase {
    async execute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const cards = await new AsyncSearchService().executeQuery(request)
        const mapper = new CardMapper()
        return new Response(ErrorType.NULL, cards.map(card => mapper.toDto(card)))
    }
}
