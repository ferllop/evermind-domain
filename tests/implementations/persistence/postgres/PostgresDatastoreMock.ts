import {PostgresDatastore} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import {QueryResult} from 'node-postgres'
import {QueryResultBuilder} from './QueryResultBuilder.js'
import {PostgresDatastoreError} from './PostgresDatastoreError.js'

export class PostgresDatastoreMock extends PostgresDatastore<any> {
    private resultToReturn: QueryResult = new QueryResultBuilder().build()
    private errorToThrow: PostgresDatastoreError | null = null

    override async query() {
        if (this.errorToThrow) {
            throw this.errorToThrow
        }
        return this.resultToReturn
    }


    returnResult(result: QueryResult) {
        this.resultToReturn = result
    }

    throwError(error: PostgresDatastoreError) {
        this.errorToThrow = error
    }

}