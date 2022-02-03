import {PostgresDatastore} from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import {QueryResult} from 'node-postgres'
import {QueryResultBuilder} from './QueryResultBuilder.js'
import {PostgresDatastoreError} from '../../../../src/implementations/persistence/postgres/PostgresDatastoreError.js'

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

    throwErrorWithCode(code: string) {
        const error = new PostgresDatastoreError('', 0, 'error')
        error.code = code
        this.errorToThrow = error
    }

}