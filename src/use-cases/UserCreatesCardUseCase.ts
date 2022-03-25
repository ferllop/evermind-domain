import {CardFactory} from '../domain/card/CardFactory.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserCreatesCardUseCase extends WithAuthorizationUseCase<UserCreatesCardRequest, CardDto> {
    constructor() {
        super(['authorId',
            'question',
            'answer',
            'labelling'])
    }

    protected async internalExecute(request: UserCreatesCardRequest): Promise<Response<CardDto>> {
        const {requesterId, ...unidentifiedCard} = request
        const card = new CardFactory().createFromDto(unidentifiedCard, await this.getRequesterPermissions())
        await new CardRepository().add(card)
        return Response.OkWithData(card.toDto())
    }
}
