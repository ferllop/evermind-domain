import { AsyncCardRepository } from '../card/AsyncCardRepository.js'
import { Card } from '../card/Card.js'
import { Label } from '../card/Label.js'
import { Labelling } from '../card/Labelling.js'
import { AsyncUserRepository } from '../user/AsyncUserRepository.js'
import { Query } from './Query.js'
import { Search } from './Search.js'

export class AsyncSearchService {
    async executeQuery(query: Query): Promise<Card[]> {
        const search = new Search(query.query)
        let userCards!: Card[]
        let cardsWithLabels: Card[]

        if (search.hasAuthor() && search.hasLabels()) {
            const user = await new AsyncUserRepository().findOne(user => {
                return search.getAuthorUsername().toString() === user.username
            })
            if (user.isNull()) {
                return []
            }
            userCards = await new AsyncCardRepository().findByAuthorId(user.getId())
            if (userCards.length === 0) {
                return []
            }
            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = await new AsyncCardRepository().findByLabelling(new Labelling(labels))
            return userCards.filter(userCard => {                
                return cardsWithLabels.some(card => card.getId().equals(userCard.getId()))
            })
        }

        if (search.hasAuthor()) {
            const user = await new AsyncUserRepository().findOne(user => {
                return search.getAuthorUsername().toString() === user.username
            })
            if (user.isNull()) {
                return []
            }
            return await new AsyncCardRepository().findByAuthorId(user.getId())
        }

            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = await new AsyncCardRepository().findByLabelling(new Labelling(labels))
            return cardsWithLabels
    }
}
