import {PostgresDatastore} from '../PostgresDatastore'
import {QueryResult} from 'pg'
import {SubscriptionRow} from './SubscriptionRow'

export class SubscriptionPostgresDatastore extends PostgresDatastore {

    override async query(query: string): Promise<QueryResult<SubscriptionRow>> {
        return super.query(query)
    }
}