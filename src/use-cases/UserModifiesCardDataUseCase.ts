import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {Response} from './Response.js'
import {UserModifiesCardDataRequest} from './UserModifiesCardDataRequest.js'
import {CardDto} from '../domain/card/CardDto.js'
import {UseCase} from './UseCase.js'
import {InputDataNotValidError} from '../domain/errors/InputDataNotValidError.js'
import {CardNotFoundError} from '../domain/errors/CardNotFoundError.js'

export class UserModifiesCardDataUseCase extends UseCase<UserModifiesCardDataRequest, CardDto | null> {
    protected getRequiredRequestFields(): string[] {
        return ['id', 'userId']
    }

    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {userId, ...cardData} = request
        if (!new CardFactory().arePropertiesValid(cardData)) {
            throw new InputDataNotValidError()
        }

        const {id, ...data} = cardData
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(new CardIdentification(id))
        if (card.isNull()) {
            throw new CardNotFoundError()
        }
        await cardRepository.update(new CardFactory().apply(card, data))

        return Response.OkWithoutData()
    }

}




