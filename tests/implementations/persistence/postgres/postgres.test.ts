import { PostgresDatastore } from '../../../../src/implementations/persistence/postgres/PostgresDatastore.js'
import { assert, suite } from '../../../test-config.js'

const postgresDatastore = suite('Postgres datastore')

postgresDatastore('should connect to testing database', async () => {
    const sut = new PostgresDatastore()
    const result = await sut.query('SELECT NOW()')
    assert.instance(new Date(result.rows[0]), Date)
})

if(process.env.WITH_POSTGRES){
    postgresDatastore.run()
}
