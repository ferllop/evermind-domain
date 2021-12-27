import { PostgresDatastore, PostgresError } from "../../implementations/persistence/postgres/PostgresDatastore";
import { DomainError } from "../errors/DomainError";
import { ErrorType } from "../errors/ErrorType";
import { AuthorIdentification } from "./AuthorIdentification";
import { Card } from "./Card";
import { CardDto } from "./CardDto";
import { CardIdentification } from "./CardIdentification";
import { CardMapper } from "./CardMapper";
import { Labelling } from "./Labelling";

export class CardDao {

    constructor(private datastore: PostgresDatastore) {
    }

    async add(card: Card) {
        const query = `BEGIN;
        INSERT INTO ${CardDatabaseMap.TABLE_NAME}(
            ${CardDatabaseMap.ID},
            ${CardDatabaseMap.AUTHOR},
            ${CardDatabaseMap.QUESTION},
            ${CardDatabaseMap.ANSWER}
            ) VALUES (
            '${card.getId().getId()}',
            '${card.getAuthorID().getId()}',
            '${card.getQuestion().getValue()}',
            '${card.getAnswer().getValue()}');
            ${this.getInsertLabellingQuery(card.getId(), card.getLabelling())};
            COMMIT;`
        const result = await this.datastore.query(query) 

        if (result.code === PostgresError.NOT_UNIQUE_FIELD) { 
            throw new DomainError(ErrorType.CARD_ALREADY_EXISTS)
        }
    }

    private getInsertLabellingQuery(cardId: CardIdentification, labelling: Labelling) {
        const labelsValuesString = labelling.getLabels().reduce<string[]>( (accum, label) => {
            const result = `('${cardId.getId()}','${label}')`
            return accum.concat(result)
        }, [])
        return `INSERT INTO ${CardLabelDatabaseMap.TABLE_NAME} VALUES ${labelsValuesString.join(',')}`
    }

    async delete(id: CardIdentification) {
        const query = `DELETE FROM ${CardDatabaseMap.TABLE_NAME} WHERE id = '${id.getId()}'`
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async update(card: Card) {
        const query = `BEGIN;
            UPDATE ${CardDatabaseMap.TABLE_NAME} SET 
            ${CardDatabaseMap.QUESTION} = '${card.getQuestion().getValue()}',
            ${CardDatabaseMap.ANSWER} = '${card.getAnswer().getValue()}'
            WHERE ${CardDatabaseMap.ID} = '${card.getId().getId()}';
            DELETE FROM ${CardLabelDatabaseMap.TABLE_NAME} WHERE ${CardLabelDatabaseMap.CARD_ID} = '${card.getId().getId()}';
            ${this.getInsertLabellingQuery(card.getId(), card.getLabelling())};
            COMMIT;`
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async findByAuthorId(id: AuthorIdentification): Promise<Card[]> {
        const query = `SELECT 
        ${CardDatabaseMap.ID}, 
        ${CardDatabaseMap.AUTHOR},
        ${CardDatabaseMap.QUESTION},
        ${CardDatabaseMap.ANSWER}
            FROM ${CardDatabaseMap.TABLE_NAME}
            WHERE ${CardDatabaseMap.AUTHOR} = '${id.getId()}'` 
        const result = await this.datastore.query(query)
        const cards = result.rows.map((cardDto: CardDto) => new CardMapper().fromDto(cardDto)) 
        return cards
    }

    getCreateTableQuery() {
        return `
            CREATE TABLE ${CardDatabaseMap.TABLE_NAME}(
                ${CardDatabaseMap.ID} UUID PRIMARY KEY,
                ${CardDatabaseMap.AUTHOR} UUID,
                ${CardDatabaseMap.QUESTION} TEXT,
                ${CardDatabaseMap.ANSWER} TEXT
            );`
    }

    getCreateCardLabelRelationTableQuery() {
        return `CREATE TABLE card_label (
                    card_id UUID NOT NULL,
                    label TEXT NOT NULL,
                    FOREIGN KEY (card_id) REFERENCES cards (id) ON DELETE CASCADE,
                    PRIMARY KEY (card_id, label)
                );`
    }

}

enum CardDatabaseMap {
    TABLE_NAME = 'cards', 
    ID = 'id',
    AUTHOR = 'author_id',
    QUESTION = 'question',
    ANSWER = 'answer',
}

enum CardLabelDatabaseMap {
    TABLE_NAME = 'card_label',
    CARD_ID = 'card_id',
    LABEL = 'label',
}
