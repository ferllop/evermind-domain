import {NodeNativeUuid} from '../NodeNativeUuidGenerator.js'
import {precondition, PreconditionError} from '../preconditions.js'
import {Dependency} from './Dependency.js'
import {AsyncInMemoryDatastore} from '../persistence/in-memory/AsyncInMemoryDatastore.js'
import {NewInMemoryDatastore} from '../persistence/in-memory/NewInMemoryDatastore.js'

export class ImplementationsContainer {
    static instance = new ImplementationsContainer()

    private container: Map<Dependency, unknown>

    constructor() {
        this.container = new Map()
        this.initWithDefaultImplementations()
    }

    initWithDefaultImplementations() {
        this.container.set(Dependency.UUID, new NodeNativeUuid())
            .set(Dependency.DATASTORE, new NewInMemoryDatastore())
            .set(Dependency.ASYNC_DATASTORE, new AsyncInMemoryDatastore())
            .set(Dependency.PRECONDITIONS, {precondition, PreconditionError})
    }

    static get(dependency: Dependency) {
        if (!this.instance.container.has(dependency)) {
            throw new Error('Dependency is not implemented')
        }
        return this.instance.container.get(dependency)
    }

    static set(name: Dependency, implementation: unknown) {
        this.instance.container.set(name, implementation)
    }

}
