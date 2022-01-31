import pg from 'pg'
import {QueryResult} from 'pg'
const {Pool} = pg
export abstract class PostgresDatastore<RowType> {
    private pool: InstanceType<typeof Pool>

    constructor() {
        this.pool = new Pool()
    }

    async query(query: string): Promise<QueryResult<RowType>> {
        const result = await this.pool.query(query)
        await this.pool.end()
        return result
    }
}


