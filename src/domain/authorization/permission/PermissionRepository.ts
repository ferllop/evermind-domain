import {PermissionDao} from './PermissionDao.js'
import {Permission} from './Permission.js'
import {PersistenceFactory} from '../../../implementations/persistence/PersistenceFactory.js'

export class PermissionRepository {
    dao: PermissionDao

    constructor() {
        this.dao = PersistenceFactory.getPermissionDao()
    }

    async has(permission: Permission) {
        return this.dao.has(permission)
    }

    async add(permission: Permission) {
        return this.dao.insert(permission)
    }
}