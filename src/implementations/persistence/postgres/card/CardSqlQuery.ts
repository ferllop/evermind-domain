import {Card} from '../../../../domain/card/Card'
import {CardIdentification} from '../../../../domain/card/CardIdentification'
import {Labelling} from '../../../../domain/card/Labelling'
import {AuthorIdentification} from '../../../../domain/card/AuthorIdentification'
import {CardDatabaseMap} from "./CardDatabaseMap";
import {LabellingDatabaseMap} from "./LabellingDatabaseMap";
import {UserDatabaseMap} from "../user/UserDatabaseMap";

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
        return `DELETE
                FROM ${CardDatabaseMap.TABLE_NAME}
                WHERE ${CardDatabaseMap.ID} = '${id.getId()}'`
    }

    private getInsertLabellingQuery(cardId: CardIdentification, labelling: Labelling) {
        const labelsValuesString = labelling.getLabels().reduce<string[]>((accum, label) => {
            const result = `('${cardId.getId()}','${label}')`
            return accum.concat(result)
        }, [])
        return `INSERT INTO ${LabellingDatabaseMap.TABLE_NAME}
                VALUES ${labelsValuesString.join(',')}`
    }

    private selectAllCards() {
        return `SELECT ${CardDatabaseMap.ID},
                       ${CardDatabaseMap.AUTHOR},
                       ${CardDatabaseMap.QUESTION},
                       ${CardDatabaseMap.ANSWER},
                       array(SELECT ${LabellingDatabaseMap.LABEL}
                             FROM ${LabellingDatabaseMap.TABLE_NAME}
                             WHERE ${LabellingDatabaseMap.CARD_ID} = ${CardDatabaseMap.ID}) as labelling
                FROM ${CardDatabaseMap.TABLE_NAME}`
    }

    selectCardById(id: CardIdentification) {
        return `${this.selectAllCards()} WHERE ${CardDatabaseMap.ID} = '${id.getId()}'`
    }

    selectCardByAuthorId(id: AuthorIdentification) {
        return `${this.selectAllCards()} WHERE ${CardDatabaseMap.AUTHOR} = '${id.getId()}'`
    }

    selectCardByLabelling(labelling: Labelling) {
        const labels = labelling.getLabels().map(label => label.getValue())
        const whereClause = `${LabellingDatabaseMap.LABEL} = '` + labels.join(`' OR ${LabellingDatabaseMap.LABEL} = '`) + `'`
        return `${this.selectAllCards()} WHERE ${CardDatabaseMap.ID} in 
            (SELECT ${LabellingDatabaseMap.CARD_ID}
             FROM ${LabellingDatabaseMap.TABLE_NAME} 
            WHERE ${whereClause} 
            GROUP BY ${LabellingDatabaseMap.CARD_ID} 
            HAVING COUNT(${LabellingDatabaseMap.LABEL}) = ${labels.length})`
    }

    createCardsTable() {
        return `CREATE TABLE ${CardDatabaseMap.TABLE_NAME}
                (
                    ${CardDatabaseMap.ID}       UUID PRIMARY KEY,
                    ${CardDatabaseMap.AUTHOR}   UUID,
                    ${CardDatabaseMap.QUESTION} TEXT,
                    ${CardDatabaseMap.ANSWER}   TEXT,
                    FOREIGN KEY (${CardDatabaseMap.AUTHOR})
                        REFERENCES ${UserDatabaseMap.TABLE_NAME} (${UserDatabaseMap.ID}) ON DELETE CASCADE
                );`
    }

    createLabellingTable() {
        return `CREATE TABLE ${LabellingDatabaseMap.TABLE_NAME}
                (
                    ${LabellingDatabaseMap.CARD_ID} UUID NOT NULL,
                    ${LabellingDatabaseMap.LABEL}   TEXT NOT NULL,
                    FOREIGN KEY (${LabellingDatabaseMap.CARD_ID})
                        REFERENCES ${CardDatabaseMap.TABLE_NAME} (${CardDatabaseMap.ID}) ON DELETE CASCADE,
                    PRIMARY KEY (${LabellingDatabaseMap.CARD_ID}, ${LabellingDatabaseMap.LABEL})
                );`
    }
}