import { Query } from '../models/search/Query.js'
import { Search } from '../models/search/Search.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class SearchController {
    executeQuery(query: Query, datastore: Datastore) {
        new Search(query.query)
        datastore.create('da', {id: 'df'})
    }
}
