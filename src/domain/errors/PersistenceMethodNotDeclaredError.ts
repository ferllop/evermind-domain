import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class PersistenceMethodNotDeclaredError extends DomainError {
    constructor() {
        super(DomainErrorCode.PERSISTENCE_METHOD_NOT_DECLARED, 'Provide the persistence for the whole evermind app with EVERMIND_PERSISTENCE_TYPE environment variable')
    }
}