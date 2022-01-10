import { ImplementationsContainer } from '../../src/implementations/implementations-container/ImplementationsContainer.js'
import { NodeNativeUuid } from '../../src/implementations/NodeNativeUuidGenerator.js'
import { assert, suite } from '../test-config.js'
import {Dependency} from '../../src/implementations/implementations-container/Dependency.js'

const nodeNativeUuid = suite('Node native uuid')

nodeNativeUuid('should be the active implementation', () => {
    assert.equal(ImplementationsContainer.get(Dependency.UUID), new NodeNativeUuid())
})

nodeNativeUuid.run()
