import {Response} from './Response.js'
import {UserCreatesCardRequest} from 'evermind-types'
import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from 'evermind-types'
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
        const storedCard = await new CardRepository(authorization).add(card)
        return Response.OkWithData(storedCard.toDto())
    }
}
