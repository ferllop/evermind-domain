import { Response } from '../../../src/models/value/Response.js'
import { ErrorType } from '../../../src/errors/ErrorType.js'

export class ResultMother {

    static isEmptyOk<T>(result: Response<T>) {
        return result.data === null && result.error === null
    }

    static isOkWithDataStrings<T extends { [key: string]: any }>(result: Response<T|null>, data: { [key: string]: any }, propToCheck: string) {
        if (result.error !== null) {
            return false
        }

        if (result.data === null) {
            return false
        }

        if (!result.data.hasOwnProperty(propToCheck) || !data[propToCheck]) {
                const existingData: {[key: string]: any} = result.data
                return existingData[propToCheck] === data[propToCheck]
        }

        return true
    }

    static isNotFound<T>(result: Response<T>) {
        return result.data === null && result.error === ErrorType.RESOURCE_NOT_FOUND
    }

    static isRemoved<T>(result: Response<T>) {
        return this.isNotFound(result)
    }

    static isInputInvalid<T>(result: Response<T>) {
        return result.data === null && result.error === ErrorType.INPUT_DATA_NOT_VALID
    }

}
