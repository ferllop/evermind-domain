export enum ErrorType {
    NULL = 0,
    INPUT_DATA_NOT_VALID = 1,
    RESOURCE_NOT_FOUND = 2,
    DATA_FROM_STORAGE_NOT_VALID = 3,
    CARD_NOT_FOUND = 4,
    USER_NOT_FOUND = 5,
    SUBSCRIPTION_NOT_EXISTS = 6,
    USER_IS_ALREADY_SUBSCRIBED_TO_CARD = 7
}

export const ErrorEnglish = new Map()
    .set(ErrorType.NULL, 'No error')
    .set(ErrorType.RESOURCE_NOT_FOUND, 'Resource not found')
    .set(ErrorType.INPUT_DATA_NOT_VALID, 'Data received from use case is not valid')
    .set(ErrorType.DATA_FROM_STORAGE_NOT_VALID, 'Data received from storage is not valid')
    .set(ErrorType.USER_NOT_FOUND, 'User not exists')
    .set(ErrorType.CARD_NOT_FOUND, 'Card not exists')
    .set(ErrorType.SUBSCRIPTION_NOT_EXISTS, 'Subscription not exists')
    .set(ErrorType.USER_IS_ALREADY_SUBSCRIBED_TO_CARD, 'User is already subscribed to card')

