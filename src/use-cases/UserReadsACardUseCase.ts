import { CardDto } from '../models/card/CardDto.js';
import { CardMapper } from '../models/card/CardMapper.js';
import { CardRepository } from '../models/card/CardRepository.js';
import { ErrorType } from '../models/errors/ErrorType.js';
import { Identification } from '../models/value/Identification.js';
import { Response } from './Response.js';
import { UserReadsACardRequest } from './UserReadsACardRequest.js';

export class UserReadsACardUseCase {

    execute(request: UserReadsACardRequest): Response<CardDto|null> {
        if(!Identification.isValid(request.id)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const card = new CardRepository().findById(new Identification(request.id))
        if(card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        return new Response(ErrorType.NULL, new CardMapper().toDto(card))
    }
    
}
