import { randomUUID } from 'crypto'

export class NodeNativeUuid {
    getUuid(): string {
        return randomUUID()
    }
}
