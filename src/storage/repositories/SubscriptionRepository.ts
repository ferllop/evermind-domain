import { Subscription } from '../../models/subscription/Subscription.js';
import { SubscriptionField } from '../../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../../models/subscription/SubscriptionMapper.js';
import { Identification } from '../../models/value/Identification.js';
import { Datastore } from '../datastores/Datastore.js';

export class SubscriptionRepository {

    constructor(private datastore: Datastore) {}
    
    add(subscription: Subscription) {
        const dto = new SubscriptionMapper().toDto(subscription)
        this.datastore.create(SubscriptionField.TABLE_NAME, dto)
    }

    retrieve() {

    }

    update() {

    }

    delete() {

    }

    nextIdentification() {
        return Identification.create()
    }
}
