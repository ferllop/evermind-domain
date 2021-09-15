import { precondition, PreconditionError } from '../../src/implementations/preconditions.js'
import { suite, assert } from '../test-config.js'

const preconditions = suite('Preconditions')

preconditions('should throw a PreconditionError when a precondition is offended', () => {
  assert.throws(() => precondition(false), (error: Error) => error instanceof PreconditionError)
})

preconditions.run()

