import { PreconditionError } from '../../../src/lib/preconditions.js'
import { Labelling } from '../../../src/models/card/Labelling.js'
import { assert, suite } from '../../test-config.js'

const labelling = suite('Labelling')

labelling('labels should be saved in lowercase', () => {
    const upperCaseLabel = new Labelling("LABEL1")
    assert.equal(upperCaseLabel.getLabel(0), 'label1')
})

labelling('labels can be retrieved as a comma separated text list', () => {
    const labelling = new Labelling("label1, label2, label3")
    assert.equal("label1, label2, label3", labelling.toString())
})

labelling('wrong labels in comma separated list will be ignored', () => {
    const wrongLabelling = new Labelling(",,,label1, ,label2, label3,,,")
    assert.equal("label1, label2, label3", wrongLabelling.toString())
})

labelling('wrong characters in a label throw assert error', () => {
    assert.throws(() => new Labelling("label#1"), error => error instanceof PreconditionError)
})

labelling('wrong characters in a label contained in a comma separated list will throw assert error', () => {
    assert.throws(() => new Labelling("label1, label2#uyu"), error => error instanceof PreconditionError)
})

labelling('wrong characters in a label contained in list object will throw assert error', () => {
    assert.throws(() => new Labelling(["label#1", "label2"]), error => error instanceof PreconditionError)
})

labelling.run()
