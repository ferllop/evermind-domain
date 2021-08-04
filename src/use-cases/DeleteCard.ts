import { CardController } from '../controllers/CardController.js'
import { IdDto } from '../models/value/IdDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class DeleteCardUseCase {
    
    execute(dto: IdDto, datastore: Datastore): Response<null> {
        const error = new CardController().deleteCard(dto, datastore)
        return new Response(error.getType(), null)
    }
    
}
