import {CardFactory} from '../domain/card/CardFactory.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {CardDto} from '../domain/card/CardDto.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'
import {UserIdentification} from '../domain/user/UserIdentification.js'

export class UserCreatesCardUseCase extends WithAuthorizationUseCase<UserCreatesCardRequest, CardDto> {
    constructor() {
        super(['authorId',
            'question',
            'answer',
            'labelling'])
    }

    protected async internalExecute(request: UserCreatesCardRequest): Promise<Response<CardDto>> {
        const {requesterId, ...unidentifiedCard} = request
        const userPermissions = await new PermissionRepository().findUserPermissions(UserIdentification.recreate(requesterId))
        const card = new CardFactory().createFromDto(unidentifiedCard, userPermissions)
        await new CardRepository().add(card)
        return Response.OkWithData(card.toDto())
    }
}
