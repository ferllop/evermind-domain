import {CardRepository} from '../domain/card/CardRepository.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {Identification} from '../domain/shared/value/Identification.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from './UserRemovesCardRequest.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserRemovesCardUseCase extends UseCase<UserRemovesCardRequest, null> {
    protected getRequiredRequestFields(): string[] {
        return ['id']
    }

    protected async internalExecute(request: UserRemovesCardRequest): Promise<Response<null>> {
        if (!Identification.isValid(request.id)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const cardRepository = await new CardRepository()
        const card = await cardRepository.findById(new Identification(request.id))
        if (card.isNull()) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        await cardRepository.delete(card)

        return Response.OkWithoutData()
    }

}
