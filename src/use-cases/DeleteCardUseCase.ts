import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Identification } from '../models/value/Identification.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { DeleteCardRequest } from './DeleteCardRequest'

export class DeleteCardUseCase {
    
    execute(request: DeleteCardRequest, datastore: Datastore): Response<null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const id = new Identification(request.id) 
        const error = new CardController().deleteCard(id, datastore)
        return new Response(error.getType(), null)
    }
    
}