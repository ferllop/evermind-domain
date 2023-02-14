import {WithRequesterRequest} from '../types/requests/WithRequesterRequest.js'
import {UseCase} from './UseCase.js'
import {Response} from './Response.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {Id} from '../types/types/Id.js'
import {UserAuthorization} from '../domain/authorization/permission/UserAuthorization.js'

export abstract class WithAuthorizationUseCase<Request extends WithRequesterRequest, ResponseType> extends UseCase<Request, ResponseType> {
    requesterId?: Id

    constructor(requestedFields: string[]) {
        super(requestedFields.concat('requesterId'))
    }

    override async execute(request: Request): Promise<Response<null> | Response<ResponseType>> {
        this.requesterId = request.requesterId
        return super.execute(request)
    }

    protected async getRequesterPermissions() {
        return await new PermissionRepository().findUserPermissions(
            RequesterIdentification.recreate(this.requesterId!))
    }

    protected async getAuthorization() {
        const permissions = await new PermissionRepository().findUserPermissions(
            RequesterIdentification.recreate(this.requesterId!))
        return new UserAuthorization(permissions)
    }
}
