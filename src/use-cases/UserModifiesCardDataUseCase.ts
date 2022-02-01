import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {Response} from './Response.js'
import {UserModifiesCardDataRequest} from './UserModifiesCardDataRequest.js'
import {CardDto} from '../domain/card/CardDto.js'
import {UseCase} from './UseCase.js'
import {DomainError} from '../domain/errors/DomainError.js'

export class UserModifiesCardDataUseCase extends UseCase<UserModifiesCardDataRequest, CardDto | null> {
    protected getRequiredRequestFields(): string[] {
        return ['id', 'userId']
    }

    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {userId, ...cardData} = request
        if (!new CardFactory().arePropertiesValid(cardData)) {
            throw new DomainError(ErrorType.INPUT_DATA_NOT_VALID)
        }

        const {id, ...data} = cardData
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(new CardIdentification(id))
        if (card.isNull()) {
            throw new DomainError(ErrorType.CARD_NOT_FOUND)
        }
        await cardRepository.update(card.apply(data))

        return Response.OkWithoutData()
    }

}




