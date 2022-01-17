import {User} from '../../../domain/user/User'
import {SubscriptionMapper} from '../../../domain/subscription/SubscriptionMapper'
import {Identification} from '../../../domain/shared/value/Identification'
import {Dependency} from '../../implementations-container/Dependency'
import {Criteria} from '../../../domain/shared/Criteria'
import {Datastore} from '../../../domain/shared/Datastore'
import {DomainError} from '../../../domain/errors/DomainError'
import {NullSubscription} from '../../../domain/subscription/NullSubscription'
import {SubscriptionField} from '../../../domain/subscription/SubscriptionField'
import {Subscription} from '../../../domain/subscription/Subscription'
import {SubscriptionDto} from '../../../domain/subscription/SusbcriptionDto'
import {ImplementationsContainer} from '../../implementations-container/ImplementationsContainer'
import {ErrorType} from '../../../domain/errors/ErrorType'
import {SubscriptionDao} from '../../../domain/subscription/SubscriptionDao'


export class SubscriptionInMemoryDao implements SubscriptionDao {
    protected readonly tableName = SubscriptionField.TABLE_NAME
    protected mapper = new SubscriptionMapper()
    protected datastore = ImplementationsContainer.get(Dependency.DATASTORE) as Datastore

    async insert(entity: Subscription) {
        const result = await this.datastore.create(this.tableName, this.mapper.toDto(entity))
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async delete(entity: Subscription) {
        if (entity.isNull()) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = await this.datastore.delete(this.tableName, entity.getId().getId())
        if (!deleted) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

    }

    async findById(id: Identification): Promise<Subscription> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.read<SubscriptionDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    async update(entity: Subscription) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, this.mapper.toDto(entity))
        if (!updated) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
    }

    async find(criteria: Criteria<SubscriptionDto>): Promise<Subscription[]> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return []
        }
        const result = await this.datastore.findMany(this.tableName, criteria)
        return result.map((dto: SubscriptionDto) => this.mapper.fromDto(dto))
    }

    async findOne(criteria: Criteria<SubscriptionDto>) {
        if (!await this.datastore.hasTable(this.tableName)) {
            return this.getNull()
        }

        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return this.getNull()
        }

        return this.mapper.fromDto(result)
    }

    findByUserId(user: User) {
        const criteria = (subscription: SubscriptionDto) => {
            return subscription.userId === user.getId().getId()
        }
        return this.find(criteria)
    }

    getNull() {
        return NullSubscription.getInstance()
    }
}
