import {CardDto} from '../types/dtos/CardDto.js'
import {SearchService} from '../domain/search/SearchService.js'
import {Response} from './Response.js'
import {UserSearchesForCardsRequest} from './UserSearchesForCardsRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {MayBeWithAuthorizationUseCase} from './MayBeWithAuthorizationUseCase.js'

export class UserSearchesForCardsUseCase extends MayBeWithAuthorizationUseCase<UserSearchesForCardsRequest, CardDto[]> {
    constructor() {
        super(['query'])
    }

    protected async internalExecute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const authorization = await this.getAuthorization()
        const cardRepository = new CardRepository(authorization)
        const cards = await new SearchService().executeQuery(request, cardRepository)
        return Response.OkWithData(cards.map(card => card.toDto()))
    }
}
