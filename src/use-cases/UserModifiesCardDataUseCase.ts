import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js'

export class UserModifiesCardDataUseCase {
    
    execute(request: UserModifiesCardDataRequest, datastore: Datastore): Response<null> {
        const mapper = new CardMapper()
        if (!mapper.isDtoValid(request)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const card = mapper.fromDto(request)
        const error = new CardController().updateCard(card, datastore)
        return new Response(error.getType(), null)
    }

}


