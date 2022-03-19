import {CardFactory} from '../domain/card/CardFactory.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {UseCase} from './UseCase.js'
import {CardDto} from '../domain/card/CardDto.js'
import {Id} from '../domain/shared/value/Id.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'

export class UserCreatesCardUseCase extends UseCase<UserCreatesCardRequest & {requesterId: Id}, CardDto> {
    constructor() {
        super(['authorId',
            'question',
            'answer',
            'labelling'])
    }

    protected async internalExecute(request: UserCreatesCardRequest & {requesterId: Id}): Promise<Response<CardDto>> {
        const {requesterId, ...unidentifiedCard} = request
        const card = new CardFactory().fromDto(unidentifiedCard)
        await new CardRepository().add(card, new RequesterIdentification(requesterId))
        return Response.OkWithData(card.toDto())
    }
}
