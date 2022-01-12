import {Card} from "./Card";
import {CardIdentification} from "./CardIdentification";
import {AuthorIdentification} from "./AuthorIdentification";
import {Labelling} from "./Labelling";

export interface CardDao {
    insert(card: Card): Promise<void>;

    update(card: Card): Promise<void>;

    delete(id: CardIdentification): Promise<void>;

    findByAuthorId(id: AuthorIdentification): Promise<Card[]>;

    findByLabelling(labelling: Labelling): Promise<Card[]>;

    findById(id: CardIdentification): Promise<Card>;
}
