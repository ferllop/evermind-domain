import {Card} from '../../../domain/card/Card'
import {CardIdentification} from '../../../domain/card/CardIdentification'
import {Labelling} from '../../../domain/card/Labelling'
import {AuthorIdentification} from '../../../domain/card/AuthorIdentification'
import {UserDatabaseMap} from './UserSqlQuery'

enum CardDatabaseMap {
    TABLE_NAME = 'cards',
    ID = 'id',
    AUTHOR = 'author_id',
    QUESTION = 'question',
    ANSWER = 'answer',
}

enum LabellingDatabaseMap {
    TABLE_NAME = 'labelling',
    CARD_ID = 'card_id',
    LABEL = 'label',
}

export class CardSqlQuery {
    insert(card: Card) {
        return `BEGIN;
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
    }

    update(card: Card) {
        return `BEGIN;
            UPDATE ${CardDatabaseMap.TABLE_NAME} SET 
            ${CardDatabaseMap.QUESTION} = '${card.getQuestion().getValue()}',
            ${CardDatabaseMap.ANSWER} = '${card.getAnswer().getValue()}'
            WHERE ${CardDatabaseMap.ID} = '${card.getId().getId()}';
            DELETE FROM ${LabellingDatabaseMap.TABLE_NAME} WHERE ${LabellingDatabaseMap.CARD_ID} = '${card.getId().getId()}';
            ${this.getInsertLabellingQuery(card.getId(), card.getLabelling())};
            COMMIT;`
    }

    delete(id: CardIdentification) {
        return `DELETE FROM ${CardDatabaseMap.TABLE_NAME} WHERE id = '${id.getId()}'`
    }

    private getInsertLabellingQuery(cardId: CardIdentification, labelling: Labelling) {
        const labelsValuesString = labelling.getLabels().reduce<string[]>((accum, label) => {
            const result = `('${cardId.getId()}','${label}')`
            return accum.concat(result)
        }, [])
        return `INSERT INTO ${LabellingDatabaseMap.TABLE_NAME} VALUES ${labelsValuesString.join(',')}`
    }

    selectCardById(id: CardIdentification) {
        return `SELECT 
        ${CardDatabaseMap.ID}, 
        ${CardDatabaseMap.AUTHOR},
        ${CardDatabaseMap.QUESTION},
        ${CardDatabaseMap.ANSWER},
        array(SELECT ${LabellingDatabaseMap.LABEL}
            FROM labelling
            WHERE ${LabellingDatabaseMap.CARD_ID} = ${CardDatabaseMap.ID}) as labelling
        FROM ${CardDatabaseMap.TABLE_NAME}
        WHERE ${CardDatabaseMap.ID} = '${id.getId()}'`
    }

    selectCardByAuthorId(id: AuthorIdentification) {
        return `SELECT 
        ${CardDatabaseMap.ID}, 
        ${CardDatabaseMap.AUTHOR},
        ${CardDatabaseMap.QUESTION},
        ${CardDatabaseMap.ANSWER},
        array(SELECT ${LabellingDatabaseMap.LABEL}
            FROM labelling
            WHERE ${LabellingDatabaseMap.CARD_ID} = ${CardDatabaseMap.ID}) as labelling
        FROM ${CardDatabaseMap.TABLE_NAME}
        WHERE ${CardDatabaseMap.AUTHOR} = '${id.getId()}'`
    }

    selectLabellingByCardId(id: CardIdentification) {
        return `SELECT 
        ${LabellingDatabaseMap.LABEL}
            FROM ${LabellingDatabaseMap.TABLE_NAME}
            WHERE ${LabellingDatabaseMap.CARD_ID} = '${id.getId()}'`
    }

    createCardsTable() {
        return `CREATE TABLE ${CardDatabaseMap.TABLE_NAME}(
                ${CardDatabaseMap.ID} UUID PRIMARY KEY,
                ${CardDatabaseMap.AUTHOR} UUID,
                ${CardDatabaseMap.QUESTION} TEXT,
                ${CardDatabaseMap.ANSWER} TEXT,
                FOREIGN KEY (${CardDatabaseMap.AUTHOR})
                    REFERENCES ${UserDatabaseMap.TABLE_NAME} (${UserDatabaseMap.ID}) ON DELETE CASCADE
            );`
    }

    createLabellingTable() {
        return `CREATE TABLE ${LabellingDatabaseMap.TABLE_NAME} (
                    ${LabellingDatabaseMap.CARD_ID} UUID NOT NULL,
                    ${LabellingDatabaseMap.LABEL} TEXT NOT NULL,
                    FOREIGN KEY (${LabellingDatabaseMap.CARD_ID}) 
                        REFERENCES ${CardDatabaseMap.TABLE_NAME} (${CardDatabaseMap.ID}) ON DELETE CASCADE,
                    PRIMARY KEY (${LabellingDatabaseMap.CARD_ID}, ${LabellingDatabaseMap.LABEL})
                );`
    }
}