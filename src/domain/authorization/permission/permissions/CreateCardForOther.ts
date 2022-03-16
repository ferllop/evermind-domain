import {Permission} from '../Permission.js'
import {UserIdentification} from '../../../user/UserIdentification.js'
import {PermissionRepository} from '../PermissionRepository.js'
import {PermissionValue} from '../PermissionValue.js'

export class CreateCardForOther extends Permission {
    constructor(userId: UserIdentification) {
        super(userId, 'CREATE_CARD_FOR_OTHER')
    }

    override async validate(): Promise<PermissionValue[]> {
        const hasPermission = await new PermissionRepository().has(this)
        return hasPermission ? [] : [this.getValue()]
    }
}