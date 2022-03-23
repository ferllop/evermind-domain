import {WithRequesterRequest} from './WithRequesterRequest.js'
import {UseCase} from './UseCase.js'

export abstract class WithAuthorizationUseCase<Request extends WithRequesterRequest, ResponseType> extends UseCase<Request, ResponseType> {
    constructor(requiredFields: string[]) {
        super(requiredFields.concat(['requesterId']))
    }
}