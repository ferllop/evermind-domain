import { CardRepository } from '../card/CardRepository.js'
import { Card } from '../card/Card.js'
import { Label } from '../card/Label.js'
import { Labelling } from '../card/Labelling.js'
import { UserRepository } from '../user/UserRepository.js'
import { Query } from './Query.js'
import { Search } from './Search.js'
import {Username} from '../user/Username.js'

export class SearchService {
    async executeQuery(query: Query): Promise<Card[]> {
        const search = new Search(query.query)
        let userCards!: Card[]
        let cardsWithLabels: Card[]

        if (search.hasAuthor() && search.hasLabels()) {
            const user = await new UserRepository().findByUsername(
                new Username(search.getAuthorUsername().toString()))

            if (user.isNull()) {
                return []
            }
            userCards = await new CardRepository().findByAuthorId(user.getId())
            if (userCards.length === 0) {
                return []
            }
            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = await new CardRepository().findByLabelling(new Labelling(labels))
            return userCards.filter(userCard => {                
                return cardsWithLabels.some(card => card.getId().equals(userCard.getId()))
            })
        }

        if (search.hasAuthor()) {
            const user = await new UserRepository().findByUsername(
                new Username(search.getAuthorUsername().toString()))

            if (user.isNull()) {
                return []
            }
            return await new CardRepository().findByAuthorId(user.getId())
        }

            const labels: Label[] = search.getLabels().map(token => new Label(token.getValue()))
            cardsWithLabels = await new CardRepository().findByLabelling(new Labelling(labels))
            return cardsWithLabels
    }
}
