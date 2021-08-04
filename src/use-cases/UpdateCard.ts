import { CardController } from '../controllers/CardController.js'
import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'

export class UpdateCardUseCase {
    
    execute(dto: CardDto & any, datastore: Datastore): Response<null> {
        const error = new CardController().updateCard(dto, datastore)
        return new Response(error.getType(), null)
    }

}
