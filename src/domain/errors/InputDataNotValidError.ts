import {DomainErrorCode} from './DomainErrorCode.js'
import {DomainError} from './DomainError.js'

export class InputDataNotValidError extends DomainError {
    constructor() {
        super(DomainErrorCode.INPUT_DATA_NOT_VALID, 'Input data is not valid')
    }
}