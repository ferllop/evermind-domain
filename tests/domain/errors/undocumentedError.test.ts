import {assert, suite} from '../../test-config.js'
import {UndocumentedError} from '../../../src/domain/errors/UndocumentedError.js'

const error = suite('Undocumented error')

error('its message should contain the error message that caused the error the error code number 1', () => {
    const errorMessage = 'the-error'
    const error = new UndocumentedError(new Error(errorMessage))
    assert.equal(error.message, errorMessage)
    assert.equal(error.getCode(), 1)
})

error.run()