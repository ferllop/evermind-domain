import { suite, test } from 'uvu'
import * as assert from 'uvu/assert'

process.env.ENABLE_PRECONDITIONS = 'true'

if (!process.env.PGPASSWORD) {
    throw new Error('Password for postgres database is not found. ' +
        'Please provide one as an environment or process variable.')
}

export { assert, suite, test }
