import {CardDto} from '../domain/card/CardDto.js'
import {SearchService} from '../domain/search/SearchService.js'
import {Response} from './Response.js'
import {UserSearchesForCardsRequest} from './UserSearchesForCardsRequest.js'
import {UseCase} from './UseCase.js'

export class UserSearchesForCardsUseCase extends UseCase<UserSearchesForCardsRequest, CardDto[]>{
    protected getRequiredRequestFields(): string[] {
        return ['query']
    }

    protected async internalExecute(request: UserSearchesForCardsRequest): Promise<Response<CardDto[]>> {
        const cards = await new SearchService().executeQuery(request)
        return Response.OkWithData(cards.map(card => card.toDto()))
    }
}
