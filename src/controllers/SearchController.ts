import { Card } from '../models/card/Card.js'
import { Response } from '../models/value/Response.js'
import { Query } from '../models/search/Query.js'
import { Search } from '../models/search/Search.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardController } from './CardController.js'
import { UserController } from './UserController.js'

export class SearchController {
    executeQuery(query: Query, datastore: Datastore): Response<Card[]> {
        const search = new Search(query.query)
        if (!search.hasAuthor()) {
            return new CardController().findByLabels(search.getLabels(), datastore)
        }

        const user = new UserController().findByUsername(search.getAuthorUsername(), datastore)
        if(user.data.length === 0) {
            return Response.OkWithData([])
        }
        
        if(!search.hasLabels()) {
            return new CardController().findByAuthorId(user.data[0].getId(), datastore)
        }

        const {error, data: userCards} = new CardController().findByAuthorId(user.data[0].getId(), datastore)
        const result = userCards.filter( card => card.getLabelling().includesAllLabels(search.getLabels()))
        return new Response(error, result)
    }
}
