export class ErrorType {
    static RESOURCE_NOT_FOUND = new ErrorType('Resource not found')
    static INPUT_DATA_NOT_VALID = new ErrorType('Data received from use case is not valid')
    static DATA_FROM_STORAGE_NOT_VALID = new ErrorType('Data received from storage is not valid')
    
    /** @type {string} */
    message

    /**
     * 
     * @param {string} message 
     */
    constructor(message) {
        this.message = message
    }

    getValue() {
        return this.message
    }
    
}
