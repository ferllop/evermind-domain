import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js'

export class UserModifiesCardDataUseCase {
    
    execute(request: UserModifiesCardDataRequest, datastore: Datastore): Response<null> {
        
        const {userId, ...cardData} = request
        if (!new CardMapper().arePropertiesValid(cardData)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const error = new CardController().updateCard(cardData, datastore)
        return new Response(error.getType(), null)
    }
    
}




