import {CardRepository} from '../domain/card/CardRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from './UserRemovesCardRequest.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserRemovesCardUseCase extends WithAuthorizationUseCase<UserRemovesCardRequest, null> {

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserRemovesCardRequest): Promise<Response<null>> {
        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(Identification.recreate(request.id))
        const userPermissions = await new PermissionRepository().findUserPermissions(RequesterIdentification.recreate(request.requesterId))
        await cardRepository.delete(card, userPermissions)
        return Response.OkWithoutData()
    }

}
