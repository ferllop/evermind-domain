import {UserSqlQuery} from '../../../../src/implementations/persistence/postgres/user/UserSqlQuery.js'
import {CardSqlQuery} from '../../../../src/implementations/persistence/postgres/card/CardSqlQuery.js'
import {
    SubscriptionSqlQuery
} from '../../../../src/implementations/persistence/postgres/subscription/SubscriptionSqlQuery.js'
import {PostgresDatastore} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'

export async function cleanDatabase() {
    const postgresDatastore = new class extends PostgresDatastore<any>{}()
    try {
        await postgresDatastore.query('DROP TABLE IF EXISTS subscriptions; ' +
            'DROP TABLE IF EXISTS cards CASCADE; ' +
            'DROP TABLE IF EXISTS labelling; ' +
            'DROP TABLE IF EXISTS users;' +
            new UserSqlQuery().createUsersTable() + ';' +
            new CardSqlQuery().createCardsTable() + ';' +
            new CardSqlQuery().createLabellingTable() + ';' +
            new SubscriptionSqlQuery().createTable() + ';'
        )
    } catch (error) {
        console.log('ERROR:', error)
    }
}