import { CardRepository } from '../domain/card/CardRepository.js';
import { CardIdentification } from '../domain/card/CardIdentification.js';
import { CardMapper } from '../domain/card/CardMapper.js';
import { ErrorType } from '../domain/errors/ErrorType.js';
import { Response } from './Response.js';
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js';

export class UserModifiesCardDataUseCase {
    
    async execute(request: UserModifiesCardDataRequest): Promise<Response<null>> {
        
        const {userId, ...cardData} = request
        if (!new CardMapper().arePropertiesValid(cardData)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const {id, ...data} = cardData
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(new CardIdentification(id))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        try {
            await cardRepository.update(card.apply(data))
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }
    }
    
}




