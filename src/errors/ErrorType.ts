export enum ErrorType {
    NULL = 'No error',
    RESOURCE_NOT_FOUND = 'Resource not found',
    INPUT_DATA_NOT_VALID = 'Data received from use case is not valid',
    DATA_FROM_STORAGE_NOT_VALID = 'Data received from storage is not valid',
    USER_NOT_FOUND = 'User not exists',
    CARD_NOT_FOUND = 'Card not exists',
    SUBSCRIPTION_NOT_EXISTS = 'Subscription not exists',
    USER_IS_ALREADY_SUBSCRIBED_TO_CARD = 'User is already subscribed to card'
}
