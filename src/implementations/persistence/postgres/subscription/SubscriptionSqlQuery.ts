import {SubscriptionDatabaseMap} from './SubscriptionDatabaseMap.js'
import {UserDatabaseMap} from '../user/UserDatabaseMap.js'
import {CardDatabaseMap} from '../card/CardDatabaseMap.js'
import {Subscription} from '../../../../domain/subscription/Subscription.js'
import {SubscriptionIdentification} from '../../../../domain/subscription/SubscriptionIdentification.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'

export class SubscriptionSqlQuery {
    createTable() {
        return `CREATE TABLE ${SubscriptionDatabaseMap.TABLE_NAME}
                (
                    ${SubscriptionDatabaseMap.ID}          UUID PRIMARY KEY,
                    ${SubscriptionDatabaseMap.USER_ID}     UUID,
                    ${SubscriptionDatabaseMap.CARD_ID}     UUID,
                    ${SubscriptionDatabaseMap.LEVEL}       SMALLINT,
                    ${SubscriptionDatabaseMap.LAST_REVIEW} TIMESTAMPTZ,
                    FOREIGN KEY (${SubscriptionDatabaseMap.USER_ID})
                        REFERENCES ${UserDatabaseMap.TABLE_NAME} (${UserDatabaseMap.ID}) ON DELETE CASCADE,
                    FOREIGN KEY (${SubscriptionDatabaseMap.CARD_ID})
                        REFERENCES ${CardDatabaseMap.TABLE_NAME} (${CardDatabaseMap.ID}) ON DELETE CASCADE
                )`
    }

    insert(subscription: Subscription) {
        return `INSERT INTO ${SubscriptionDatabaseMap.TABLE_NAME}(${SubscriptionDatabaseMap.ID},
                                                                  ${SubscriptionDatabaseMap.USER_ID},
                                                                  ${SubscriptionDatabaseMap.CARD_ID},
                                                                  ${SubscriptionDatabaseMap.LEVEL},
                                                                  ${SubscriptionDatabaseMap.LAST_REVIEW})
                VALUES ('${subscription.getId().getId()}',
                        '${subscription.getUserID().getId()}',
                        '${subscription.getCardID().getId()}',
                        ${subscription.getLevel().getValue()},
                        '${subscription.getLastReview().toDtoFormat()}')`
    }

    update(subscription: Subscription) {
        return `UPDATE ${SubscriptionDatabaseMap.TABLE_NAME}
                SET ${SubscriptionDatabaseMap.LEVEL}       = ${subscription.getLevel().getOrdinal()},
                    ${SubscriptionDatabaseMap.LAST_REVIEW} = '${subscription.getLastReview().toDtoFormat()}'
                WHERE ${SubscriptionDatabaseMap.ID} = '${subscription.getId().getId()}'`
    }

    delete(id: SubscriptionIdentification) {
        return `DELETE
                FROM ${SubscriptionDatabaseMap.TABLE_NAME}
                WHERE ${SubscriptionDatabaseMap.ID} = '${id.getId()}'`
    }

    findById(id: SubscriptionIdentification) {
        return `${this.selectAllSubscriptions()} WHERE id = '${id.getId()}'`
    }

    findByUserId(id: UserIdentification) {
        return `${this.selectAllSubscriptions()} WHERE user_id = '${id.getId()}'`
    }

    private selectAllSubscriptions() {
        return `SELECT id, user_id, card_id, level, last_review
                FROM subscriptions`
    }
}