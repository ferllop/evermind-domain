import { Pool } from "pg";

export class PostgresDatastore {
    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }

    async query(query: string) {
        try {
            const result = await this.pool.query(query)
            this.pool.end()
            return result
        } catch (error) {
            return error
        }
    }
}

export enum PostgresError {
    NOT_UNIQUE_FIELD = '23505',
    TABLE_DOES_NOT_EXISTS = '42P01',
}


