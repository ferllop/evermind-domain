import { AsyncCardRepository } from '../models/card/AsyncCardRepository.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserRemovesCardRequest } from './UserRemovesCardRequest.js';

export class AsyncUserRemovesCardUseCase {
    
    async execute(request: UserRemovesCardRequest): Promise<Response<null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const cardRepository = await new AsyncCardRepository()
        const card = await cardRepository.findById(new Identification(request.id))

        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const error = await cardRepository.delete(card)
        return new Response(error.getCode(), null)
    }
    
}
