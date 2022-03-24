import {PermissionDao} from './PermissionDao.js'
import {PersistenceFactory} from '../../../implementations/persistence/PersistenceFactory.js'
import {UserIdentification} from '../../user/UserIdentification.js'
import {PermissionDto} from './PermissionDto.js'

export class PermissionRepository {
    dao: PermissionDao

    constructor() {
        this.dao = PersistenceFactory.getPermissionDao()
    }

    async has(permission: PermissionDto) {
        return this.dao.has(permission)
    }

    async add(permission: PermissionDto) {
        return this.dao.insert(permission)
    }

    async findUserPermissions(userId: UserIdentification) {
        return this.dao.findUserPermissions(userId)
    }
}