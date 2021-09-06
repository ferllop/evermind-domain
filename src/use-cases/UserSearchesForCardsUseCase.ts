import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { SearchController } from "../controllers/SearchController.js"
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { UserSearchesForCardsRequest } from './UserSearchesForCardsRequest.js'

export class UserSearchesForCardsUseCase {
    execute(request: UserSearchesForCardsRequest, datastore: Datastore): Response<CardDto[]> {
        const cards = new SearchController().executeQuery(request, datastore)
        const mapper = new CardMapper()
        return new Response(ErrorType.NULL, cards.map(card => mapper.toDto(card)))
    }
}
