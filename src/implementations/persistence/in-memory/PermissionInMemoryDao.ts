import {Identification} from '../../../domain/shared/value/Identification.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {PermissionDao} from '../../../domain/authorization/permission/PermissionDao.js'
import {PermissionDto} from '../../../domain/authorization/permission/PermissionDto.js'
import {IdDto} from 'evermind-types'
import {UserIdentification} from '../../../domain/user/UserIdentification.js'
import {Id} from 'evermind-types'
import {PermissionValue} from '../../../domain/authorization/permission/PermissionValue.js'
import {UserPermissions} from '../../../domain/authorization/permission/UserPermissions.js'

type PermissionId = `${Id}#${PermissionValue}`

export class PermissionInMemoryDao implements PermissionDao {
    private readonly tableName = 'permissions'
    private readonly idSeparator = '#'

    constructor(protected datastore: InMemoryDatastore = new InMemoryDatastore()){
    }

    private computeId(permission: PermissionDto): PermissionId {
        return `${permission.userId}${this.idSeparator}${permission.value}`
    }

    private extractUserId(id: PermissionId) {
        return id.split(this.idSeparator)[0]
    }

    async insert(permission: PermissionDto) {
        const id = Identification.recreate(this.computeId(permission)).getValue()
        const result = await this.datastore.create(this.tableName, {id, ...permission})
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
    }

    async delete(permission: PermissionDto): Promise<boolean> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return false
        }
        return await this.datastore.delete(this.tableName, this.computeId(permission))
    }

    async has(permission: PermissionDto): Promise<boolean> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return false
        }
        const result = await this.datastore.read<IdDto & PermissionDto>(this.tableName, this.computeId(permission))
        return !!result
    }

    async findUserPermissions(userId: UserIdentification): Promise<UserPermissions> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return new UserPermissions(userId, [])
        }
        const result = await this.datastore.findMany<PermissionDto & IdDto>(
            this.tableName,
                dto => this.extractUserId(dto.id as PermissionId) === userId.getValue())
        return new UserPermissions(userId, result.map(dto => dto.value))
    }



}