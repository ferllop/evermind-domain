import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { SearchController } from "../controllers/SearchController.js"
import { Query } from "../models/search/Query.js"
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'


export class SearchCardsUseCase {
    execute(dto: Query, datastore: Datastore): Response<CardDto[]> {
        const {error, data} = new SearchController().executeQuery(dto, datastore)
        return new Response(error, data.map(card => CardMapper.toDto(card)))
    }
}
