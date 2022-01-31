import { CardRepository } from '../domain/card/CardRepository.js'
import { CardIdentification } from '../domain/card/CardIdentification.js'
import { CardFactory } from '../domain/card/CardFactory.js'
import { ErrorType } from '../domain/errors/ErrorType.js'
import { Response } from './Response.js'
import { UserModifiesCardDataRequest } from './UserModifiesCardDataRequest.js'
import {CardDto} from '../domain/card/CardDto.js'
import {UseCase} from './UseCase.js'

export class UserModifiesCardDataUseCase extends UseCase<UserModifiesCardDataRequest, CardDto|null>{
    protected getRequiredRequestFields(): string[] {
        return ['id', 'userId']
    }
    
    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {userId, ...cardData} = request
        if (!new CardFactory().arePropertiesValid(cardData)) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const {id, ...data} = cardData
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(new CardIdentification(id))
        if (card.isNull()) {
            return Response.withError(ErrorType.CARD_NOT_FOUND)
        }

        try {
            await cardRepository.update(card.apply(data))
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }
    }
    
}




