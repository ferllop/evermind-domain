import { ErrorType } from '../errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserRemovesCardRequest } from './UserRemovesCardRequest.js'
import { Response } from './Response.js';
import { CardRepository } from '../models/card/CardRepository.js';

export class UserRemovesCardUseCase {
    
    execute(request: UserRemovesCardRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const cardRepository = new CardRepository(datastore)
        const card = cardRepository.retrieve(new Identification(request.id))

        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const error = cardRepository.delete(card)
        return new Response(error.getCode(), null)
    }
    
}
