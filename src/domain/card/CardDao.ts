import {Card} from './Card.js'
import {CardIdentification} from './CardIdentification.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {Labelling} from './Labelling.js'
import {StoredCard} from './StoredCard.js'

export interface CardDao {
    insert(card: Card): Promise<StoredCard>;

    update(card: Card): Promise<void>;

    delete(id: CardIdentification): Promise<void>;

    findByAuthorId(id: AuthorIdentification): Promise<Card[]>;

    findByLabelling(labelling: Labelling): Promise<Card[]>;

    findById(id: CardIdentification): Promise<Card>;
}
