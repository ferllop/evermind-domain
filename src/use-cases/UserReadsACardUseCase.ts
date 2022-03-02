import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserReadsACardRequest} from './UserReadsACardRequest.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'

export class UserReadsACardUseCase extends UseCase<UserReadsACardRequest, CardDto|null>{

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserReadsACardRequest): Promise<Response<CardDto|null>> {
        if(!Identification.isValid(request.id)) {
            throw new InputDataNotValidError()
        }
        
        const card = await new CardRepository().findById(new Identification(request.id))
        if(card.isNull()) {
            throw new CardNotFoundError()
        }

        return Response.OkWithData(card.toDto())
    }
    
}
