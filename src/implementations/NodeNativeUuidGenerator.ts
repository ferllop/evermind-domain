import { randomUUID } from 'crypto'
import { UuidGenerator } from '../domain/value/UuidGenerator.js'

export class NodeNativeUuid implements UuidGenerator {
    getUuid(): string {
        return randomUUID()
    }
}
