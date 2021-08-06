import { suite, test } from 'uvu'
import * as assert from 'uvu/assert'

process.env.ENABLE_PRECONDITIONS = 'true'

export { assert, suite, test }
