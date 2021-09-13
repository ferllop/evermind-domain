import { CardDto } from '../models/card/CardDto.js'
import { SearchController } from "../controllers/SearchController.js"
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { UserSearchesForCardsRequest } from './UserSearchesForCardsRequest.js'
import { Response } from './Response.js';

export class UserSearchesForCardsUseCase {
    execute(request: UserSearchesForCardsRequest, datastore: Datastore): Response<CardDto[]> {
        const cards = new SearchController().executeQuery(request, datastore)
        const mapper = new CardMapper()
        return new Response(ErrorType.NULL, cards.map(card => mapper.toDto(card)))
    }
}
