import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { CardDto } from '../models/card/CardDto.js'
import { IdDto } from '../models/value/IdDto.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'

export class ReadCardUseCase {

    execute(dto: IdDto, datastore: Datastore): Response<CardDto|null> {
        const result = new CardController().retrieveCard(dto, datastore)
        
        if (result instanceof DomainError) {
            return new Response(result.getType(), null)
        }

        return new Response(ErrorType.NULL, CardMapper.toDto(result))
    }
    
}
