import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { SearchController } from "../controllers/SearchController.js"
import { Query } from "../models/search/Query.js"
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'


export class SearchCardsUseCase {
    execute(dto: Query, datastore: Datastore): Response<CardDto[]> {
        const cards = new SearchController().executeQuery(dto, datastore)
        return new Response(ErrorType.NULL, cards.map(card => CardMapper.toDto(card)))
    }
}
