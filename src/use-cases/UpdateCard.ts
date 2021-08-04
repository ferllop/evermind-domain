import { CardController } from '../controllers/CardController.js'
import { ErrorType } from '../errors/ErrorType.js'
import { CardDto } from '../models/card/CardDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { Identified } from '../storage/datastores/Identified.js'
import { CardMapper } from '../storage/storables/CardMapper.js'

export class UpdateCardUseCase {
    
    execute(dto: Identified<CardDto>, datastore: Datastore): Response<null> {
        if (!CardMapper.isDtoValid(dto)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        const card = CardMapper.fromDto(dto)
        const error = new CardController().updateCard(card, datastore)
        return new Response(error.getType(), null)
    }

}
