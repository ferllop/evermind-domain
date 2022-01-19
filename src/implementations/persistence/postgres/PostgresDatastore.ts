import {Pool, QueryResult} from 'pg'

export abstract class PostgresDatastore<RowType> {
    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }

    async query(query: string): Promise<QueryResult<RowType>> {
        const result = await this.pool.query(query)
        await this.pool.end()
        return result
    }
}


