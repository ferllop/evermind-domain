import {assert} from '../../../test-config.js'

export function assertQueriesAreEqual(actual: string, expect: string) {
    const removeIndent = (str: string) => {
        return str.replace(/\s+/g, ' ')
    }
    assert.equal(removeIndent(actual), removeIndent(expect))
}