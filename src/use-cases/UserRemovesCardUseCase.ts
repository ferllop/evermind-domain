import {CardRepository} from '../domain/card/CardRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from './UserRemovesCardRequest.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserRemovesCardUseCase extends WithAuthorizationUseCase<UserRemovesCardRequest, null> {

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserRemovesCardRequest): Promise<Response<null>> {
        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(Identification.recreate(request.id))
        await cardRepository.delete(card, await this.getRequesterPermissions())
        return Response.OkWithoutData()
    }

}
