import { Response } from 'src/models/value/Response.js'
import { Query } from '../models/search/Query.js'
import { Search } from '../models/search/Search.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardController } from './CardController.js'

export class SearchController {
    executeQuery(query: Query, datastore: Datastore): Response {
        const search = new Search(query.query)
        return new CardController().findByLabels(search.getLabels(), datastore)
    }
}
