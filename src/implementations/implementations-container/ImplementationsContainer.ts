import {Dependency} from './Dependency.js'

export class ImplementationsContainer {
    static instance = new ImplementationsContainer()

    private container: Map<Dependency, unknown>

    constructor() {
        this.container = new Map()
        this.initWithDefaultImplementations()
    }

    initWithDefaultImplementations() {


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
