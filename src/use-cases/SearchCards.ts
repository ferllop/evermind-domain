import { SearchController } from "../controllers/SearchController.js"
import { Query } from "../models/search/Query.js"
import { Datastore } from '../storage/datastores/Datastore.js'


export class SearchCardsUseCase {
    execute(dto: Query, datastore: Datastore) {
        new SearchController().executeQuery(dto, datastore)
    }
}
