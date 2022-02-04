import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class DataFromStorageNotValidError extends DomainError {
    constructor() {
        super(DomainErrorCode.DATA_FROM_STORAGE_NOT_VALID, 'Data received from storage is not valid')
    }
}