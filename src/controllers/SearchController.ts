import { Card } from '../models/card/Card.js'
import { Query } from '../models/search/Query.js'
import { Search } from '../models/search/Search.js'
import { Datastore } from '../models/Datastore.js'
import { Labelling } from '../models/card/Labelling.js'
import { Label } from '../models/card/Label.js'
import { UserRepository } from '../models/user/UserRepository.js'
import { CardRepository } from '../models/card/CardRepository.js'

export class SearchController {
    executeQuery(query: Query, datastore: Datastore): Card[] {
        const search = new Search(query.query)
        let userCards!: Card[]
        let cardsWithLabels: Card[]

        if (search.hasAuthor() && search.hasLabels()) {
            const user = new UserRepository(datastore).findByUsername(search.getAuthorUsername().toString())
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
            const user = new UserRepository(datastore).findByUsername(search.getAuthorUsername().toString())
            if (user.isNull()) {
                return []
            }
            return new CardRepository(datastore).findByAuthorId(user.getId())
        }

            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = new CardRepository(datastore).findByLabelling(new Labelling(labels))
            return cardsWithLabels
        





        // console.log('aqui', search.getLabels())
        // const labelling = new Labelling(search.getLabels().map(label => new Label(label.toString())))
        // if (!search.hasAuthor()) {
        //     return new CardController().findByLabelling(labelling, datastore)
        // }

        // const user = new UserController().findByUsername(search.getAuthorUsername().toString(), datastore)
        // if(user instanceof DomainError) {
        //     return []
        // }

        // if(!search.hasLabels()) {
        //     return new CardController().findByAuthorId(user.getId(), datastore)
        // }

        // const cards = new CardController().findByAuthorId(user.getId(), datastore)
        // return cards.filter( card => card.getLabelling().isIncluded(labelling))
    }
}
