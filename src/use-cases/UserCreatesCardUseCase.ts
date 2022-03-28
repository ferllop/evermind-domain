import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardFactory} from '../domain/card/CardFactory.js'

export class UserCreatesCardUseCase extends WithAuthorizationUseCase<UserCreatesCardRequest, CardDto> {
    constructor() {
        super(['authorId',
            'question',
            'answer',
            'labelling'])
    }

    protected async internalExecute(request: UserCreatesCardRequest): Promise<Response<CardDto>> {
        const {requesterId, ...unidentifiedCard} = request
        const authorization = await this.getAuthorization()
        const card = new CardFactory(authorization).createFromDto(unidentifiedCard)
        await new CardRepository(authorization).add(card)
        return Response.OkWithData(card.toDto())
    }
}
