import { suite, assert } from '../test-config.js'
import { precondition, PreconditionError } from 'preconditions'

const preconditions = suite('Preconditions')

preconditions('should throw a PreconditionError when a precondition is offended', () => {
  assert.throws(() => precondition(false), error => error instanceof PreconditionError)
})

preconditions.run()

