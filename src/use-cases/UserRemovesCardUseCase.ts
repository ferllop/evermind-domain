import { CardRepository } from '../domain/card/CardRepository.js';
import { ErrorType } from '../domain/errors/ErrorType.js';
import { Identification } from '../domain/shared/value/Identification.js';
import { Response } from './Response.js';
import { UserRemovesCardRequest } from './UserRemovesCardRequest.js';

export class UserRemovesCardUseCase {
    
    async execute(request: UserRemovesCardRequest): Promise<Response<null>> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(new Identification(request.id))

        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        try {
            await cardRepository.delete(card)
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }
    }
    
}
