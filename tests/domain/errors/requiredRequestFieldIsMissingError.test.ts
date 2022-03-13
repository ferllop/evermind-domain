import {assert, suite} from '../../test-config.js'
import {RequiredRequestFieldIsMissingError} from '../../../src/domain/errors/RequiredRequestFieldIsMissingError.js'

const error = suite('Required field missing error')

error('its message should contain a more generic text when the required missing fields are not provided', () => {
    const error = new RequiredRequestFieldIsMissingError()
    const expectedErrorMessage = 'Required request field(s) missing'
    assert.equal(error.message, expectedErrorMessage)
})

error('its message should contain the required missing fields if provided', () => {
    const error = new RequiredRequestFieldIsMissingError(['field1', 'field2'])
    const expectedErrorMessage = 'Required request field(s) missing: field1, field2'
    assert.equal(error.message, expectedErrorMessage)
})

error.run()