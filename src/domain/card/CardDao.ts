import {Card} from './Card.js'
import {CardIdentification} from './CardIdentification.js'
import {AuthorIdentification} from './AuthorIdentification.js'
import {Labelling} from './Labelling.js'

export interface CardDao {
    insert(card: Card): Promise<void>;

    update(card: Card): Promise<void>;

    delete(id: CardIdentification): Promise<void>;

    findByAuthorId(id: AuthorIdentification): Promise<Card[]>;

    findByLabelling(labelling: Labelling): Promise<Card[]>;

    findById(id: CardIdentification): Promise<Card>;
}
