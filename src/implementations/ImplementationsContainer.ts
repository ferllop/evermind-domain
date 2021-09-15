import { InMemoryDatastore } from './InMemoryDatastore.js'
import { NodeNativeUuid } from './NodeNativeUuidGenerator.js'
import { precondition, PreconditionError } from './preconditions.js'

export class ImplementationsContainer {
    static instance = new ImplementationsContainer()

    private container: Map<string, unknown>

    constructor() {
        this.container = new Map()
        .set('uuid', new NodeNativeUuid())
        .set('datastore', new InMemoryDatastore())
        .set('preconditions', { precondition, PreconditionError})
    }

    static get(dependency: string) {
        return this.instance.container.get(dependency)
    }

    static set(name: string, implementation: unknown) {
        this.instance.container.set(name, implementation)
    }

}
