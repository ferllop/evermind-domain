import {SubscriptionDao} from '../../../../domain/subscription/SubscriptionDao.js'
import {Subscription} from '../../../../domain/subscription/Subscription.js'
import {NullSubscription} from '../../../../domain/subscription/NullSubscription.js'
import {SubscriptionIdentification} from '../../../../domain/subscription/SubscriptionIdentification.js'
import {UserIdentification} from '../../../../domain/user/UserIdentification.js'
import {SubscriptionPostgresMapper} from './SubscriptionPostgresMapper.js'
import {SubscriptionPostgresDatastore} from './SubscriptionPostgresDatastore.js'
import {SubscriptionSqlQuery} from './SubscriptionSqlQuery.js'
import {PostgresErrorType} from '../PostgresErrorType.js'
import {PostgresDatastoreError} from '../PostgresDatastoreError.js'
import {SubscriptionNotExistsError} from '../../../../domain/errors/SubscriptionNotExistsError.js'
import {UserIsAlreadySubscribedToCardError} from '../../../../domain/errors/UserIsAlreadySubscribedToCardError.js'
import {CardNotFoundError} from '../../../../domain/errors/CardNotFoundError.js'
import {DataFromStorageNotValidError} from '../../../../domain/errors/DataFromStorageNotValidError.js'

export class SubscriptionPostgresDao implements SubscriptionDao {
    private sqlQuery = new SubscriptionSqlQuery()

    constructor(private datastore: SubscriptionPostgresDatastore = new SubscriptionPostgresDatastore()) {
    }

    async insert(subscription: Subscription) {
        const query = this.sqlQuery.insert(subscription)

        try {
            await this.datastore.query(query)
        } catch (error) {
            if (error instanceof PostgresDatastoreError &&
                error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new UserIsAlreadySubscribedToCardError()
            }
            throw error
        }
    }

    async delete(id: SubscriptionIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new CardNotFoundError()
        }
    }

    async findById(id: SubscriptionIdentification): Promise<Subscription> {
        const query = this.sqlQuery.findById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DataFromStorageNotValidError()
        }
        return result.rowCount === 1 ? new SubscriptionPostgresMapper().rowToSubscription(result.rows[0]) : NullSubscription.getInstance()
    }

    async update(subscription: Subscription) {
        const query = this.sqlQuery.update(subscription)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new SubscriptionNotExistsError()
        }
    }

    async findByUserId(id: UserIdentification) {
        const query = this.sqlQuery.findByUserId(id)
        const result = await this.datastore.query(query)
        return result.rows.map(new SubscriptionPostgresMapper().rowToSubscription)
    }

}