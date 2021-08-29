import { SubscriptionController } from '../controllers/SubscriptionController.js';
import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from '../models/value/Response.js';
import { Datastore } from '../storage/datastores/Datastore.js';
import { SubscribeUserToCardRequest } from './SubscribeUserToCardRequest.js';


export class SubscribeUserToCardUseCase {
    execute(request: SubscribeUserToCardRequest, datastore: Datastore) {
        if (!Subscription.isNewSubscriptionValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const error = new SubscriptionController().subscribeUserToCard(
            new Identification(request.userId),
            new Identification(request.cardId),
            datastore
        )
        return new Response(error.getType(), null)
    }
}


