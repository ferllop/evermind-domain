import { randomUUID } from 'crypto'
import { UuidGenerator } from '../domain/shared/value/UuidGenerator.js'

export class NodeNativeUuid implements UuidGenerator {
    getUuid(): string {
        return randomUUID()
    }
}
