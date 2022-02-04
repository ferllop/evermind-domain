import {CardRepository} from '../domain/card/CardRepository.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from './UserRemovesCardRequest.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'

export class UserRemovesCardUseCase extends UseCase<UserRemovesCardRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserRemovesCardRequest): Promise<Response<null>> {
        if (!Identification.isValid(request.id)) {
            throw new InputDataNotValidError()
        }

        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(new Identification(request.id))
        if (card.isNull()) {
            throw new CardNotFoundError()
        }
        await cardRepository.delete(card)

        return Response.OkWithoutData()
    }

}
