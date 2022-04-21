import {Card} from '../../../../domain/card/Card.js'
import {CardIdentification} from '../../../../domain/card/CardIdentification.js'
import {Labelling} from '../../../../domain/card/Labelling.js'
import {AuthorIdentification} from '../../../../domain/card/AuthorIdentification.js'
import {CardDatabaseMap} from './CardDatabaseMap.js'
import {LabellingDatabaseMap} from './LabellingDatabaseMap.js'
import {UserDatabaseMap} from '../user/UserDatabaseMap.js'
import {Id} from '../../../../domain/shared/value/Id.js'
import {StoredCard} from '../../../../domain/card/StoredCard.js'

export class CardSqlQuery {
    insert(card: StoredCard) {
        const {id, authorId, question, answer, labelling, visibility} = card.toDto()
        return `BEGIN;
        INSERT INTO ${CardDatabaseMap.TABLE_NAME}(
            ${CardDatabaseMap.ID},
            ${CardDatabaseMap.AUTHOR},
            ${CardDatabaseMap.QUESTION},
            ${CardDatabaseMap.ANSWER},
            ${CardDatabaseMap.VISIBILITY}
            ) VALUES (
            '${id}',
            '${authorId}',
            '${question}',
            '${answer}',
            '${visibility}');
            ${this.getInsertLabellingQuery(id, labelling)};
            COMMIT;`
    }

    update(card: Card) {
        const {id, question, answer, labelling, visibility} = card.toDto()
        return `BEGIN;
            UPDATE ${CardDatabaseMap.TABLE_NAME} SET 
            ${CardDatabaseMap.QUESTION} = '${question}',
            ${CardDatabaseMap.ANSWER} = '${answer}',
            ${CardDatabaseMap.VISIBILITY} = '${visibility}'
            WHERE ${CardDatabaseMap.ID} = '${id}';
            DELETE FROM ${LabellingDatabaseMap.TABLE_NAME} WHERE ${LabellingDatabaseMap.CARD_ID} = '${id}';
            ${this.getInsertLabellingQuery(id, labelling)};
            COMMIT;`
    }

    delete(id: CardIdentification) {
        return `DELETE
                FROM ${CardDatabaseMap.TABLE_NAME}
                WHERE ${CardDatabaseMap.ID} = '${id.getValue()}'`
    }

    private getInsertLabellingQuery(cardId: Id, labelling: string[]) {
        const labelsValuesString = labelling.reduce<string[]>((accum, label) => {
            const result = `('${cardId}','${label}')`
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
                        ${CardDatabaseMap.VISIBILITY},
                       array(SELECT ${LabellingDatabaseMap.LABEL}
                             FROM ${LabellingDatabaseMap.TABLE_NAME}
                             WHERE ${LabellingDatabaseMap.CARD_ID} = ${CardDatabaseMap.ID}) as labelling
                FROM ${CardDatabaseMap.TABLE_NAME}`
    }

    selectCardById(id: CardIdentification) {
        return `${this.selectAllCards()} WHERE ${CardDatabaseMap.ID} = '${id.getValue()}'`
    }

    selectCardByAuthorId(id: AuthorIdentification) {
        return `${this.selectAllCards()} WHERE ${CardDatabaseMap.AUTHOR} = '${id.getValue()}'`
    }

    selectCardByLabelling(labelling: Labelling) {
        const labels = labelling.getValue()
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
                    ${CardDatabaseMap.VISIBILITY} TEXT,
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