import { AsyncCardRepository } from '../models/card/AsyncCardRepository.js';
import { CardIdentification } from '../models/card/CardIdentification.js';
import { CardMapper } from '../models/card/CardMapper.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Response } from './Response.js';
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js';

export class AsyncUserModifiesCardDataUseCase {
    
    async execute(request: UserModifiesCardDataRequest): Promise<Response<null>> {
        
        const {userId, ...cardData} = request
        if (!new CardMapper().arePropertiesValid(cardData)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const {id, ...data} = cardData
        const cardRepository = new AsyncCardRepository()
        const card = await cardRepository.findById(new CardIdentification(id))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const error = await cardRepository.update(card.apply(data))
        return new Response(error.getCode(), null)
    }
    
}




