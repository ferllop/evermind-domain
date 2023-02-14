import {WithRequesterRequest} from './WithRequesterRequest.js'
import {RequesterDto} from '../types/dtos/RequesterDto.js'
import {UseCase} from './UseCase.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'
import {UserAuthorization} from '../domain/authorization/permission/UserAuthorization.js'
import {Response} from './Response.js'
import {AnonymousUserAuthorization} from '../domain/authorization/permission/AnonymousUserAuthorization.js'
import {Request} from './Request.js'

export abstract class MayBeWithAuthorizationUseCase<RequestType extends WithRequesterRequest | Omit<WithRequesterRequest, keyof RequesterDto>, ResponseType>
    extends UseCase<RequestType, ResponseType> {
    request!: Request

    override async execute(request: RequestType): Promise<Response<null> | Response<ResponseType>> {
        this.request = request
        return super.execute(request)
    }

    protected async getAuthorization() {
        if (!this.hasRequester(this.request)) {
            return new AnonymousUserAuthorization()
        }
        const requesterId = RequesterIdentification.recreate(this.request.requesterId)
        const permissions = await new PermissionRepository().findUserPermissions(requesterId)
        return new UserAuthorization(permissions)
    }

    private hasRequester(request: Request): request is WithRequesterRequest {
        return 'requesterId' in request && request.requesterId !== undefined
    }
}