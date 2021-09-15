import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserRemovesCardRequest } from './UserRemovesCardRequest.js';

export class UserRemovesCardUseCase {
    
    execute(request: UserRemovesCardRequest): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const cardRepository = new CardRepository()
        const card = cardRepository.retrieve(new Identification(request.id))

        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const error = cardRepository.delete(card)
        return new Response(error.getCode(), null)
    }
    
}
