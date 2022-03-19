import {CardRepository} from '../domain/card/CardRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from './UserRemovesCardRequest.js'
import {UseCase} from './UseCase.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'
import {Id} from '../domain/shared/value/Id.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'

export class UserRemovesCardUseCase extends UseCase<UserRemovesCardRequest & {requesterId: Id}, null> {

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserRemovesCardRequest & {requesterId: Id}): Promise<Response<null>> {
        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(Identification.recreate(request.id))
        if (card.isNull()) {
            throw new CardNotFoundError()
        }
        await cardRepository.delete(card, RequesterIdentification.recreate(request.requesterId))
        return Response.OkWithoutData()
    }

}
