import { Response } from 'src/models/value/Response.js'
import { ErrorType } from '../../../src/errors/ErrorType.js'

export class ResultMother {

    static isEmptyOk(result: Response) {
        return result.data === null && result.error === null
    }

    static isOkWithDataStrings(result: Response, data: { [key: string]: any }, propToCheck: string) {
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

    static isNotFound(result: Response) {
        return result.data === null && result.error === ErrorType.RESOURCE_NOT_FOUND
    }

    static isRemoved(result: Response) {
        return this.isNotFound(result)
    }

    static isInputInvalid(result: Response) {
        return result.data === null && result.error === ErrorType.INPUT_DATA_NOT_VALID
    }

}
