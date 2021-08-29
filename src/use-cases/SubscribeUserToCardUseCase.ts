import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from '../models/value/Response.js';
import { Datastore } from '../storage/datastores/Datastore.js';
import { CardRepository } from '../storage/repositories/CardRepository.js';
import { SubscriptionRepository } from '../storage/repositories/SubscriptionRepository.js';
import { UserRepository } from '../storage/repositories/UserRepository.js';
import { SubscribeUserToCardRequest } from './SubscribeUserToCardRequest.js';


export class SubscribeUserToCardUseCase {
    execute(request: SubscribeUserToCardRequest, datastore: Datastore) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const user = new UserRepository(datastore).findById(new Identification(request.userId))
        if (!user) {
            return Response.withError(ErrorType.USER_NOT_FOUND)
        }

        const card = new CardRepository(datastore).findById(new Identification(request.cardId))
        if (!card) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const subscription = user.subscribe(card)
        new SubscriptionRepository(datastore).add(subscription)

        return Response.OkWithoutData()
    }
}


