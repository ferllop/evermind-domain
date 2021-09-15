import { ErrorType } from '../models/errors/ErrorType.js'
import { CardDto } from '../models/card/CardDto.js'
import { Identification } from '../models/value/Identification.js'
import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { UserReadsACardRequest } from './UserReadsACardRequest.js'
import { Response } from './Response.js'
import { CardRepository } from '../models/card/CardRepository.js'

export class UserReadsACardUseCase {

    execute(request: UserReadsACardRequest, datastore: Datastore): Response<CardDto|null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const card = new CardRepository(datastore).retrieve(new Identification(request.id))
        if(card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        return new Response(ErrorType.NULL, new CardMapper().toDto(card))
    }
    
}
