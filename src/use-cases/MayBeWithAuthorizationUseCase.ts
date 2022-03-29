import {WithRequesterRequest} from './WithRequesterRequest.js'
import {RequesterDto} from './RequesterDto.js'
import {UseCase} from './UseCase.js'
import {AnonymousUserPermissions} from '../domain/authorization/permission/AnonymousUserPermissions.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'

export abstract class MayBeWithAuthorizationUseCase<RequestType extends WithRequesterRequest | Omit<WithRequesterRequest, keyof RequesterDto>, Response>
    extends UseCase<RequestType, Response> {
    protected async getUserPermissions(request: any) {
        if (!this.hasRequester(request)) {
            return new AnonymousUserPermissions()
        }
        const requesterId = RequesterIdentification.recreate(request.requesterId)
        return await new PermissionRepository().findUserPermissions(requesterId)
    }

    private hasRequester(request: any): request is WithRequesterRequest {
        return 'requesterId' in request && request.requesterId !== undefined
    }
}