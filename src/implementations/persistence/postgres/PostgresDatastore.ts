import {Pool} from "pg";

export class PostgresDatastore {
    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }

    async query(query: string) {
        const result = await this.pool.query(query)
        await this.pool.end()
        return result
    }
}

export enum PostgresErrorType {
    NOT_UNIQUE_FIELD = '23505',
    TABLE_DOES_NOT_EXISTS = '42P01',
}


