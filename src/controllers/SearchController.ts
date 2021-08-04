import { Card } from '../models/card/Card.js'
import { Query } from '../models/search/Query.js'
import { Search } from '../models/search/Search.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardController } from './CardController.js'
import { UserController } from './UserController.js'

export class SearchController {
    executeQuery(query: Query, datastore: Datastore): Card[] {
        const search = new Search(query.query)
        if (!search.hasAuthor()) {
            return new CardController().findByLabels(search.getLabels(), datastore)
        }

        const user = new UserController().findByUsername(search.getAuthorUsername(), datastore)
        if(user.data.length === 0) {
            return []
        }
        
        if(!search.hasLabels()) {
            return new CardController().findByAuthorId(user.data[0].getId(), datastore)
        }

        const cards = new CardController().findByAuthorId(user.data[0].getId(), datastore)
        return cards.filter( card => card.getLabelling().includesAllLabels(search.getLabels()))
    }
}
