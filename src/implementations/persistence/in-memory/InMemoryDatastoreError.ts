export class InMemoryDatastoreError extends Error {
    constructor(errorType: ErrorType) {
        super(errorType.valueOf())
    }
}

export enum ErrorType {
    COLLECTION_DOES_NOT_EXISTS = 'Collection does not exists',
    RESOURCE_ALREADY_EXISTS = 'Resource already exists',
    RESOURCE_DOES_NOT_EXISTS = 'Resource does not exists',
}