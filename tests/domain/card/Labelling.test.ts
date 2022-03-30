import { Label } from '../../../src/domain/card/Label.js'
import { Labelling } from '../../../src/domain/card/Labelling.js'
import { assert, suite } from '../../test-config.js'

const labelling = suite('Labelling')

labelling('labels should be saved in lowercase', () => {
    const upperCaseLabel = new Labelling([new Label("LABEL1")])
    assert.equal(upperCaseLabel.getLabel(0).getValue(), 'label1')
})

labelling('valid labelling should validate to true', () => {
    const labels = ['label1','label2','label3']
    assert.ok(Labelling.isValid(labels))
})

labelling('invalid labelling should validate to false', () => {
    const labels = ['label1','label####2','label3']
    assert.not.ok(Labelling.isValid(labels))
})

labelling.run()
