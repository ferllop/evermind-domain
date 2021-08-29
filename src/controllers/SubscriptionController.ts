import { DomainError } from '../errors/DomainError.js';
import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { SubscriptionField } from '../models/subscription/SubscriptionField.js';
import { SubscriptionMapper } from '../models/subscription/SubscriptionMapper.js';
import { SubscriptionDto } from '../models/subscription/SusbcriptionDto.js';
import { Identification } from '../models/value/Identification.js';
import { Datastore } from '../storage/datastores/Datastore.js';
import { SubscriptionRepository } from '../storage/repositories/SubscriptionRepository.js';
import { CardController } from './CardController.js';
import { CrudController } from './CrudController.js';
import { UserController } from './UserController.js';

export class SubscriptionController {

    private crudController() {
        return new CrudController<Subscription, SubscriptionDto>(SubscriptionField.TABLE_NAME, new SubscriptionMapper())
    }

    subscribeUserToCard(userId: Identification, cardId: Identification, datastore: Datastore): DomainError {
        const user = new UserController().findById(userId, datastore)
        if (!user) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const cardExists = new CardController().exists(cardId, datastore)
        if (!cardExists) {
            return new DomainError(ErrorType.RESOURCE_NOT_FOUND)
        }

        const subscription = Subscription.create(userId, cardId)
        new SubscriptionRepository(datastore).add(subscription)
        return DomainError.NULL
    }
}
