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

    static isNotFound(result: Response<null>) {
        return result.hasError(ErrorType.RESOURCE_NOT_FOUND)
    }

    static isRemoved(result: Response<null>) {
        return this.isNotFound(result)
    }

    static isInputInvalid(result: Response<null>) {
        return result.hasError(ErrorType.INPUT_DATA_NOT_VALID)
    }

}
