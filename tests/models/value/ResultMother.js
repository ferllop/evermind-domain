import { ErrorType } from '../../../src/errors/ErrorType.js'

export class ResultMother {
    static isEmptyOk(result) {
        return result.data === null && result.error === null 
    }

    static isOkWithDataStrings(result, data, propToCheck) {
        if (result.error !== null) {
            return false
        }

        for(const prop of propToCheck) {
            if (!result.data[prop] || !data[prop] || result.data[prop] !== data[prop]) {
                return false
            }    
        }

        return true
    }

    static isNotFound(result) {
        return result.data === null && result.error === ErrorType.RESOURCE_NOT_FOUND
    }

    static isRemoved(result) {
        return this.isNotFound(result)
    }

    static isInputInvalid(result) {
        return result.data === null && result.error === ErrorType.INPUT_DATA_NOT_VALID
    }

}
