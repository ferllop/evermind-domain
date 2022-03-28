import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Response} from './Response.js'
import {UserReadsACardRequest} from './UserReadsACardRequest.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'

export class UserReadsACardUseCase extends WithAuthorizationUseCase<UserReadsACardRequest, CardDto|null>{

    constructor() {
        super(['cardId'])
    }

    protected async internalExecute(request: UserReadsACardRequest): Promise<Response<CardDto|null>> {
        const card = await new CardRepository().getById(
                CardIdentification.recreate(request.cardId),
                await this.getRequesterPermissions())
        return Response.OkWithData(card.toDto())
    }
    
}
