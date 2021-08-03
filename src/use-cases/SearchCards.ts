import { Response } from 'src/models/value/Response.js'
import { SearchController } from "../controllers/SearchController.js"
import { Query } from "../models/search/Query.js"
import { Datastore } from '../storage/datastores/Datastore.js'


export class SearchCardsUseCase {
    execute(dto: Query, datastore: Datastore): Response {
        return new SearchController().executeQuery(dto, datastore)
    }
}
