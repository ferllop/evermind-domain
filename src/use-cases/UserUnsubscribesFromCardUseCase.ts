import { SubscriptionController } from '../controllers/SubscriptionController.js';
import { ErrorType } from '../errors/ErrorType.js';
import { Subscription } from '../models/subscription/Subscription.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from '../models/value/Response.js';
import { Datastore } from '../models/Datastore.js';
import { UserUnsubscribesFromCardRequest } from './UserUnsubscribesFromCardRequest.js';

export class UserUnsubscribesFromCardUseCase {
    execute(request: UserUnsubscribesFromCardRequest, datastore: Datastore) {
        if (!Subscription.isDtoValid(request.userId, request.cardId)) {
            return Response.withError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const error = new SubscriptionController().unsubscribeUserToCard(
            new Identification(request.userId),
            new Identification(request.cardId),
            datastore
        )
        
        return new Response(error.getCode(), null)
    }
}
