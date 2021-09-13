import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { UserRemovesCardRequest } from './UserRemovesCardRequest.js'
import { Response } from './Response.js';

export class UserRemovesCardUseCase {
    
    execute(request: UserRemovesCardRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const id = new Identification(request.id) 
        const error = new CardController().deleteCard(id, datastore)
        return new Response(error.getCode(), null)
    }
    
}
