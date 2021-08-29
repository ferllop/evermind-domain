import { CardController } from '../controllers/CardController.js';
import { SubscriptionController } from '../controllers/SubscriptionController.js';
import { UserController } from '../controllers/UserController.js';
import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from '../models/value/Response.js';
import { Datastore } from '../storage/datastores/Datastore.js';
import { SubscribeUserToCardRequest } from './SubscribeUserToCardRequest.js';
import { UnsubscribeUserToCardRequest } from './UnsubscribeUserToCardRequest.js';


export class UnsubscribeUserToCardUseCase {
    execute(request: UnsubscribeUserToCardRequest, datastore: Datastore) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const error = new SubscriptionController().unsubscribeUserToCard(
            new Identification(request.userId),
            new Identification(request.cardId),
            datastore
        )
        return new Response(error.getType(), null)
    }
}


