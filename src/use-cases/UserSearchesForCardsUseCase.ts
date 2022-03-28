import {CardDto} from '../domain/card/CardDto.js'
import {SearchService} from '../domain/search/SearchService.js'
import {Response} from './Response.js'
import {UserSearchesForCardsRequest} from './UserSearchesForCardsRequest.js'
import {UseCase} from './UseCase.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {AlwaysAuthorizedAuthorization} from '../../tests/implementations/AlwaysAuthorizedAuthorization.js'

export class UserSearchesForCardsUseCase extends UseCase<UserSearchesForCardsRequest, CardDto[]>{

    constructor() {
        super(['query'])
    }

    protected async internalExecute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const cardRepository = new CardRepository(new AlwaysAuthorizedAuthorization())
        const cards = await new SearchService().executeQuery(request, cardRepository)
        return Response.OkWithData(cards.map(card => card.toDto()))
    }
}
