import { CardController } from '../controllers/CardController.js'
import { DomainError } from '../errors/DomainError.js'
import { ErrorType } from '../errors/ErrorType.js'
import { CardDto } from '../models/card/CardDto.js'
import { Identification } from '../models/value/Identification.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { UserReadsACardRequest } from './UserReadsACardRequest.js'

export class UserReadsACardUseCase {

    execute(request: UserReadsACardRequest, datastore: Datastore): Response<CardDto|null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const id = new Identification(request.id) 
        
        const result = new CardController().retrieveCard(id, datastore)
        if (result instanceof DomainError) {
            return new Response(result.getType(), null)
        }

        return new Response(ErrorType.NULL, new CardMapper().toDto(result))
    }
    
}
