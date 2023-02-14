import {SubscriptionFactory} from '../../../domain/subscription/SubscriptionFactory.js'
import {Identification} from '../../../domain/shared/value/Identification.js'
import {Criteria} from './Criteria.js'
import {NullSubscription} from '../../../domain/subscription/NullSubscription.js'
import {SubscriptionField} from './SubscriptionField.js'
import {Subscription} from '../../../domain/subscription/Subscription.js'
import {SubscriptionDto} from '../../../types/dtos/SusbcriptionDto.js'
import {SubscriptionDao} from '../../../domain/subscription/SubscriptionDao.js'
import {SubscriptionIdentification} from '../../../domain/subscription/SubscriptionIdentification.js'
import {UserIdentification} from '../../../domain/user/UserIdentification.js'
import {InMemoryDatastore} from './InMemoryDatastore.js'
import {InputDataNotValidError} from '../../../domain/errors/InputDataNotValidError.js'
import {DataFromStorageNotValidError} from '../../../domain/errors/DataFromStorageNotValidError.js'
import {SubscriptionNotFoundError} from '../../../domain/errors/SubscriptionNotFoundError.js'
import {Authorization} from '../../../domain/authorization/Authorization.js'


export class SubscriptionInMemoryDao implements SubscriptionDao {
    protected readonly tableName = SubscriptionField.TABLE_NAME
    protected datastore = new InMemoryDatastore()

    constructor(
        private authorization: Authorization,
    ){}


    async insert(subscription: Subscription) {
        const result = await this.datastore.create(this.tableName, subscription.toDto())
        if (!result) {
            throw new DataFromStorageNotValidError()
        }
    }

    async delete(id: SubscriptionIdentification) {
        if (id.isNull()) {
            throw new InputDataNotValidError()
        }

        if (!await this.datastore.hasTable(this.tableName)) {
            throw new SubscriptionNotFoundError()
        }

        const deleted = await this.datastore.delete(this.tableName, id.getValue())
        if (!deleted) {
            throw new SubscriptionNotFoundError()
        }

    }

    async findById(id: Identification): Promise<Subscription> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return NullSubscription.getInstance()
        }

        const result = await this.datastore.read<SubscriptionDto>(this.tableName, id.getValue())
        if (!result || !new SubscriptionFactory(this.authorization).isDtoValid(result)) {
            return NullSubscription.getInstance()
        }

        return new SubscriptionFactory(this.authorization).fromDto(result)
    }

    async update(entity: Subscription) {
        if (!await this.datastore.hasTable(this.tableName)) {
            throw new SubscriptionNotFoundError()
        }
        const updated = this.datastore.update(this.tableName, entity.toDto())
        if (!updated) {
            throw new SubscriptionNotFoundError()
        }
    }

    async find(criteria: Criteria<SubscriptionDto>): Promise<Subscription[]> {
        if (!await this.datastore.hasTable(this.tableName)) {
            return []
        }
        const result = await this.datastore.findMany(this.tableName, criteria)
        return result.map((dto: SubscriptionDto) => new SubscriptionFactory(this.authorization).fromDto(dto))
    }

    async findOne(criteria: Criteria<SubscriptionDto>) {
        if (!await this.datastore.hasTable(this.tableName)) {
            return NullSubscription.getInstance()
        }

        const result = await this.datastore.findOne(this.tableName, criteria)

        if (!result) {
            return NullSubscription.getInstance()
        }

        return new SubscriptionFactory(this.authorization).fromDto(result)
    }

    async findByUserId(id: UserIdentification) {
        const criteria = (subscription: SubscriptionDto) => {
            return subscription.userId === id.getValue()
        }
        return await this.find(criteria)
    }
}
