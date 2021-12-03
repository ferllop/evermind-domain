import { Label } from '../../../src/domain/card/Label.js'
import { Labelling } from '../../../src/domain/card/Labelling.js'
import { assert, suite } from '../../test-config.js'

const labelling = suite('Labelling')

labelling('labels should be saved in lowercase', () => {
    const upperCaseLabel = new Labelling([new Label("LABEL1")])
    assert.ok(upperCaseLabel.getLabel(0).equals(new Label('label1')))
    assert.equal(upperCaseLabel.toString(), 'label1')
})

labelling('labels can be retrieved as a comma separated text list', () => {
    const labels = [
        new Label('label1'),
        new Label('label2'),
        new Label('label3')
    ]
    const labelling = new Labelling(labels)
    assert.equal("label1, label2, label3", labelling.toString())
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
