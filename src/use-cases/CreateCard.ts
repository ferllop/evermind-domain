import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardDto } from '../models/card/CardDto.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Unidentified } from '../storage/datastores/Unidentified.js'

export class CreateCardUseCase {
    
    execute(dto: Unidentified<CardDto>, datastore: Datastore): Response<null> {
        const mapper = new CardMapper()
        if (!mapper.isDtoValid(dto)) {
             return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const error = new CardController().storeCard(dto, datastore)
        return new Response(error.getType(), null)
    }
    
}
