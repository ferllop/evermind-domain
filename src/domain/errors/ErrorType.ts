export enum ErrorType {
    NULL,
    INPUT_DATA_NOT_VALID,
    RESOURCE_NOT_FOUND,
    DATA_FROM_STORAGE_NOT_VALID,
    CARD_NOT_FOUND,
    USER_NOT_FOUND,
    SUBSCRIPTION_NOT_EXISTS,
    USER_IS_ALREADY_SUBSCRIBED_TO_CARD,
    CARD_ALREADY_EXISTS,
    USER_ALREADY_EXISTS,
    REQUIRED_REQUEST_FIELD_IS_MISSING,
    PERSISTENCE_METHOD_NOT_DECLARED,
}

export const ErrorEnglish = new Map()
    .set(ErrorType.NULL, 'No error')
    .set(ErrorType.RESOURCE_NOT_FOUND, 'Resource not found')
    .set(ErrorType.INPUT_DATA_NOT_VALID, 'Input data is not valid')
    .set(ErrorType.DATA_FROM_STORAGE_NOT_VALID, 'Data received from storage is not valid')
    .set(ErrorType.USER_NOT_FOUND, 'User not exists')
    .set(ErrorType.CARD_NOT_FOUND, 'Card not exists')
    .set(ErrorType.SUBSCRIPTION_NOT_EXISTS, 'Subscription not exists')
    .set(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD, 'User is already subscribed to card')
    .set(ErrorType.CARD_ALREADY_EXISTS, 'Card already exists')
    .set(ErrorType.REQUIRED_REQUEST_FIELD_IS_MISSING, 'Required request field is missing')
    .set(ErrorType.PERSISTENCE_METHOD_NOT_DECLARED, 'Provide the persistence for the whole evermind app with EVERMIND_PERSISTENCE_TYPE environment variable')

