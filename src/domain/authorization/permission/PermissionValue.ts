type CardPermissionValue = 'CREATE_OWN_CARD'
    | 'CREATE_CARD_FOR_OTHER'
    | 'DELETE_OWN_CARD'
    | 'DELETE_CARD_FROM_OTHER'
    | 'UPDATE_OWN_CARD'
    | 'UPDATE_CARD_FROM_OTHER'
    | 'TRANSFER_OWN_CARD'
    | 'TRANSFER_CARD_FROM_ANOTHER'

type UserPermissionValue = 'REMOVE_OWN_ACCOUNT'
    | 'REMOVE_ACCOUNT_FROM_OTHER'
    | 'GET_DATA_FROM_OTHER_USER'

export type PermissionValue = CardPermissionValue | UserPermissionValue
