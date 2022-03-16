import {Identification} from '../../../domain/shared/value/Identification.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {PermissionDao} from '../../../domain/authorization/permission/PermissionDao.js'
import {Permission} from '../../../domain/authorization/permission/Permission.js'
import {PermissionDto} from '../../../domain/authorization/permission/PermissionDto.js'
import {IdDto} from '../../../domain/shared/value/IdDto.js'

export class PermissionInMemoryDao implements PermissionDao {
    private readonly tableName = 'permissions'

    constructor(protected datastore: InMemoryDatastore = new InMemoryDatastore()){
    }

    private computeId(permission: Permission){
        return permission.getUserId().getId() + '#' + permission.getValue()
    }

    async insert(permission: Permission) {
        const id = Identification.recreate(this.computeId(permission)).getId()
        const result = await this.datastore.create(this.tableName, {id, ...permission.toDto()})
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
    }

    async delete(permission: Permission): Promise<boolean> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return false
        }
        return await this.datastore.delete(this.tableName, this.computeId(permission))
    }

    async has(permission: Permission): Promise<boolean> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return false
        }
        const result = await this.datastore.read<IdDto & PermissionDto>(this.tableName, this.computeId(permission))
        return !!result
    }

}