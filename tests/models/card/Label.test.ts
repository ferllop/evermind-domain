import { PreconditionError } from '../../../src/lib/preconditions.js'
import { Label } from '../../../src/models/card/Label.js'
import { assert, suite } from '../../test-config.js'

const label = suite('Label')

label('wrong characters in a label throws precondition error', () => {
    assert.throws(() => new Label('label#1'), (error: Error) =>  error instanceof PreconditionError)
})

label('empty label throws precondition error', () => {
    assert.throws(() => new Label(''), (error: Error) =>  error instanceof PreconditionError)
})

label('should know when another label is equals to itself', () => {
    const label = 'label'
    assert.ok(new Label(label).equals(new Label(label)))
})

label('should know when another label is different to itself', () => {
    assert.not.ok(new Label('aLabel').equals(new Label('otherLabel')))
})

label.run()
