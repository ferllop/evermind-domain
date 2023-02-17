import pg from 'pg'
import {QueryResult} from 'pg'
const {Pool} = pg
export abstract class PostgresDatastore<RowType> {
    private pool: InstanceType<typeof Pool>

    constructor() {
        this.pool = new Pool()
    }

    async query(query: string): Promise<QueryResult<RowType>> {
        const client = await this.pool.connect()
        const result = await client.query(query)
        await client.release(true)
        return result
    }
}


