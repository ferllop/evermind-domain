import { assert, suite } from '../../../test-config.js'
import { Pool } from 'pg'

const sut = suite('Postgres datastore')

sut('should connect to testing database', async () => {
    const pool = new Pool()
    const res  = await pool.query('SELECT NOW()')
    await pool.end()
    assert.instance(new Date(res.rows[0]), Date)
})

if(process.env.WITH_POSTGRES){
    sut.run()
}
