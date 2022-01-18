import {SubscriptionDao} from '../../../../domain/subscription/SubscriptionDao'
import {Subscription} from '../../../../domain/subscription/Subscription'
import {DomainError} from '../../../../domain/errors/DomainError'
import {ErrorType} from '../../../../domain/errors/ErrorType'
import {NullSubscription} from '../../../../domain/subscription/NullSubscription'
import {PostgresErrorType} from '../PostgresDatastore'
import {SubscriptionIdentification} from '../../../../domain/subscription/SubscriptionIdentification'
import {UserIdentification} from '../../../../domain/user/UserIdentification'
import {SubscriptionPostgresMapper} from './SubscriptionPostgresMapper'
import {SubscriptionPostgresDatastore} from './SubscriptionPostgresDatastore'
import {SubscriptionSqlQuery} from './SubscriptionSqlQuery'

export class SubscriptionPostgresDao implements SubscriptionDao {
    private sqlQuery = new SubscriptionSqlQuery()

    constructor(private datastore: SubscriptionPostgresDatastore = new SubscriptionPostgresDatastore()) {
    }

    async insert(subscription: Subscription) {
        const query = this.sqlQuery.insert(subscription)

        try {
            await this.datastore.query(query)
        } catch (error) {
            if (error.code === PostgresErrorType.NOT_UNIQUE_FIELD) {
                throw new DomainError(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD)
            }
            throw error
        }
    }

    async delete(id: SubscriptionIdentification) {
        const query = this.sqlQuery.delete(id)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
    }

    async findById(id: SubscriptionIdentification): Promise<Subscription> {
        const query = this.sqlQuery.findById(id)
        const result = await this.datastore.query(query)
        if (result.rowCount > 1) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
        return result.rowCount === 1 ? new SubscriptionPostgresMapper().rowToSubscription(result.rows[0]) : NullSubscription.getInstance()
    }

    async update(subscription: Subscription) {
        const query = this.sqlQuery.update(subscription)
        const result = await this.datastore.query(query)
        if (result.rowCount === 0) {
            throw new DomainError(ErrorType.SUBSCRIPTION_NOT_EXISTS)
        }
    }

    async findByUserId(id: UserIdentification) {
        const query = this.sqlQuery.findByUserId(id)
        const result = await this.datastore.query(query)
        return result.rows.map(new SubscriptionPostgresMapper().rowToSubscription)
    }

}