import {Permission} from '../Permission.js'
import {UserIdentification} from '../../../user/UserIdentification.js'
import {PermissionRepository} from '../PermissionRepository.js'
import {PermissionValue} from '../PermissionValue.js'

export class CreateOwnCard extends Permission {
    constructor(userId: UserIdentification) {
        super(userId, 'CREATE_OWN_CARD')
    }

    override async validate(): Promise<PermissionValue[]> {
        const hasPermission = await new PermissionRepository().has(this)
        return hasPermission ? [] : [this.getValue()]
    }
}