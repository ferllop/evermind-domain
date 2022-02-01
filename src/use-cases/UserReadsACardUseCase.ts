import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserReadsACardRequest} from './UserReadsACardRequest.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserReadsACardUseCase extends UseCase<UserReadsACardRequest, CardDto|null>{
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserReadsACardRequest): Promise<Response<CardDto|null>> {
        if(!Identification.isValid(request.id)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }
        
        const card = await new CardRepository().findById(new Identification(request.id))
        if(card.isNull()) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }

        return Response.OkWithData(card.toDto())
    }
    
}
