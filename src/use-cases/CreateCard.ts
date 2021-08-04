import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardDto } from '../models/card/CardDto.js'

export class CreateCardUseCase {
    
    execute(dto: CardDto, datastore: Datastore): Response<null> {
        const error = new CardController().storeCard(dto, datastore)
        return new Response(error.getType(), null)
    }
    
}
