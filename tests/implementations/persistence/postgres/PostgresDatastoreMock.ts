import {PostgresDatastore} from "../../../../src/implementations/persistence/postgres/PostgresDatastore";
import {QueryResult} from "node-postgres";
import {QueryResultBuilder} from "./QueryResultBuilder";
import {PostgresDatastoreError} from "./PostgresDatastoreError";

export class PostgresDatastoreMock extends PostgresDatastore {
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