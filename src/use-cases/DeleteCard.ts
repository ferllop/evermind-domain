import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { IdDto } from '../models/value/IdDto.js'
import { Identification } from '../models/value/Identification.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class DeleteCardUseCase {
    
    execute(dto: IdDto, datastore: Datastore): Response<null> {
        if(!Identification.isValid(dto.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const id = new Identification(dto.id) 
        const error = new CardController().deleteCard(id, datastore)
        return new Response(error.getType(), null)
    }
    
}
