import { suite, test } from 'uvu'
import * as assert from 'uvu/assert'
import {Config} from '../src/implementations/Config.js'

Config.enablePreconditions = true

if (!Config.postgresPassword) {
    throw new Error('Password for postgres database is not found. ' +
        'Please provide one as an environment or process variable.')
}

export { assert, suite, test }
