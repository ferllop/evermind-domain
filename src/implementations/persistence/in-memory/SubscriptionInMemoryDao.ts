import {SubscriptionFactory} from '../../../domain/subscription/SubscriptionFactory'
import {Identification} from '../../../domain/shared/value/Identification'
import {Criteria} from './Criteria'
import {DomainError} from '../../../domain/errors/DomainError'
import {NullSubscription} from '../../../domain/subscription/NullSubscription'
import {SubscriptionField} from './SubscriptionField'
import {Subscription} from '../../../domain/subscription/Subscription'
import {SubscriptionDto} from '../../../domain/subscription/SusbcriptionDto'
import {ErrorType} from '../../../domain/errors/ErrorType'
import {SubscriptionDao} from '../../../domain/subscription/SubscriptionDao'
import {SubscriptionIdentification} from '../../../domain/subscription/SubscriptionIdentification'
import {UserIdentification} from '../../../domain/user/UserIdentification'
import {InMemoryDatastore} from './InMemoryDatastore'


export class SubscriptionInMemoryDao implements SubscriptionDao {
    protected readonly tableName = SubscriptionField.TABLE_NAME
    protected mapper = new SubscriptionFactory()
    protected datastore = new InMemoryDatastore()

    async insert(subscription: Subscription) {
        const result = await this.datastore.create(this.tableName, subscription.toDto())
        if (!result) {
            throw new DomainError(ErrorType.DATA_FROM_STORAGE_NOT_VALID)
        }
    }

    async delete(id: SubscriptionIdentification) {
        if (id.isNull()) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const deleted = await this.datastore.delete(this.tableName, id.getId())
        if (!deleted) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

    }

    async findById(id: Identification): Promise<Subscription> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return NullSubscription.getInstance()
        }

        const result = await this.datastore.read<SubscriptionDto>(this.tableName, id.getId())
        if (!result || !this.mapper.isDtoValid(result)) {
            return NullSubscription.getInstance()
        }

        return this.mapper.fromDto(result)
    }

    async update(entity: Subscription) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }
        const updated = this.datastore.update(this.tableName, entity.toDto())
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
            return NullSubscription.getInstance()
        }

        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return NullSubscription.getInstance()
        }

        return this.mapper.fromDto(result)
    }

    async findByUserId(id: UserIdentification) {
        const criteria = (subscription: SubscriptionDto) => {
            return subscription.userId === id.getId()
        }
        return await this.find(criteria)
    }
}
