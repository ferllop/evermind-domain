import { NodeNativeUuid } from '../../src/implementations/NodeNativeUuidGenerator.js'
import { UuidGenerator } from '../../src/models/value/UuidGenerator.js'
import { assert, suite } from '../test-config.js'

const nodeNativeUuid = suite('Node native uuid')

nodeNativeUuid('should almost always provide unique identifiers', () => {
    exerciseUuidGenerator(new NodeNativeUuid())
})
nodeNativeUuid.run()

function exerciseUuidGenerator(generator: UuidGenerator) {
    const uuid = generator.getUuid()

    for (let i = 0; i < 1_000_000; i++){
        assert.not.equal(generator.getUuid(), uuid)
    }
}

