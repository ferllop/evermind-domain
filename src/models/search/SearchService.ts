import { Card } from '../card/Card.js'
import { CardRepository } from '../card/CardRepository.js'
import { Label } from '../card/Label.js'
import { Labelling } from '../card/Labelling.js'
import { Datastore } from '../Datastore.js'
import { UserRepository } from '../user/UserRepository.js'
import { Query } from './Query.js'
import { Search } from './Search.js'

export class SearchService {
    executeQuery(query: Query, datastore: Datastore): Card[] {
        const search = new Search(query.query)
        let userCards!: Card[]
        let cardsWithLabels: Card[]

        if (search.hasAuthor() && search.hasLabels()) {
            const user = new UserRepository(datastore).findOne(user => {
                return search.getAuthorUsername().toString() === user.username
            })
            if (user.isNull()) {
                return []
            }
            userCards = new CardRepository(datastore).findByAuthorId(user.getId())
            if (userCards.length === 0) {
                return []
            }
            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = new CardRepository(datastore).findByLabelling(new Labelling(labels))
            return userCards.filter(userCard => {                
                return cardsWithLabels.some(card => card.getId().equals(userCard.getId()))
            })
        }

        if (search.hasAuthor()) {
            const user = new UserRepository(datastore).findOne(user => {
                return search.getAuthorUsername().toString() === user.username
            })
            if (user.isNull()) {
                return []
            }
            return new CardRepository(datastore).findByAuthorId(user.getId())
        }

            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = new CardRepository(datastore).findByLabelling(new Labelling(labels))
            return cardsWithLabels
    }
}
