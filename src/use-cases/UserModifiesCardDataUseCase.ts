import { ErrorType } from '../models/errors/ErrorType.js'
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js'
import { Response } from './Response.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { CardIdentification } from '../models/card/CardIdentification.js';

export class UserModifiesCardDataUseCase {
    
    execute(request: UserModifiesCardDataRequest, datastore: Datastore): Response<null> {
        
        const {userId, ...cardData} = request
        if (!new CardMapper().arePropertiesValid(cardData)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const {id, ...data} = cardData
        const cardRepository = new CardRepository(datastore)
        const card = cardRepository.retrieve(new CardIdentification(id))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        const error =cardRepository.update(card.apply(data))
        return new Response(error.getCode(), null)
    }
    
}




