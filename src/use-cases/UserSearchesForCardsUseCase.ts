import {CardDto} from '../domain/card/CardDto.js'
import {SearchService} from '../domain/search/SearchService.js'
import {Response} from './Response.js'
import {UserSearchesForCardsRequest} from './UserSearchesForCardsRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {UserAuthorization} from '../domain/authorization/permission/UserAuthorization.js'
import {MayBeWithAuthorizationUseCase} from './MayBeWithAuthorizationUseCase.js'

export class UserSearchesForCardsUseCase extends MayBeWithAuthorizationUseCase<UserSearchesForCardsRequest, CardDto[]> {
    constructor() {
        super(['query'])
    }

    protected async internalExecute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const authorization = new UserAuthorization(await this.getUserPermissions(request))
        const cardRepository = new CardRepository(authorization)
        const cards = await new SearchService().executeQuery(request, cardRepository)
        return Response.OkWithData(cards.map(card => card.toDto()))
    }
}
