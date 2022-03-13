import {DomainError} from './DomainError.js'
import {DomainErrorCode} from './DomainErrorCode.js'

export class RequiredRequestFieldIsMissingError extends DomainError {
    constructor(missingFields: string[] = []) {
        super(DomainErrorCode.REQUIRED_REQUEST_FIELD_IS_MISSING,
            RequiredRequestFieldIsMissingError.stringifyMissingFields(missingFields))
    }

    private static stringifyMissingFields(missingFields: string[]) {
        let header = 'Required request field(s) missing'
        if (missingFields.length === 0) {
            return header
        }
        return header + ': ' + missingFields.join(', ')
    }
}