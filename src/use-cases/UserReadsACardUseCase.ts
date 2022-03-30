import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Response} from './Response.js'
import {UserReadsACardRequest} from './UserReadsACardRequest.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {MayBeWithAuthorizationUseCase} from './MayBeWithAuthorizationUseCase.js'

export class UserReadsACardUseCase extends MayBeWithAuthorizationUseCase<UserReadsACardRequest, CardDto|null>{

    constructor() {
        super(['cardId'])
    }

    protected async internalExecute(request: UserReadsACardRequest): Promise<Response<CardDto|null>> {
        const cardId = CardIdentification.recreate(request.cardId)
        const card = await new CardRepository(await this.getAuthorization()).getById(cardId)
        return Response.OkWithData(card.toDto())
    }
    
}
