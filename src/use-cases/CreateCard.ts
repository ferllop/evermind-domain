import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardDto } from '../models/card/CardDto.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'

export class CreateCardUseCase {
    
    execute(dto: CardDto, datastore: Datastore): Response<null> {
        const mapper = new CardMapper()
        if (!mapper.isDtoValid(dto)) {
             return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const card = mapper.fromDto({id: '', ...dto})
        const error = new CardController().storeCard(card, datastore)
        return new Response(error.getType(), null)
    }
    
}
