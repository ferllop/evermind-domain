import {UserModifiesCardDataRequest} from './UserModifiesCardDataRequest.js'
import {Id} from '../domain/shared/value/Id.js'
import {CardDto} from '../domain/card/CardDto.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {Card} from '../domain/card/Card.js'
import {Unidentified} from '../domain/shared/value/Unidentified.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export abstract class UserModifiesCardUseCase extends WithAuthorizationUseCase<UserModifiesCardDataRequest, CardDto | null> {
    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {requesterId, id, ...cardData} = request
        const cardRepository = new CardRepository()
        const originalCard = await cardRepository.findById(new CardIdentification(id))
        await this.updateCard(originalCard, cardData, requesterId)
        return Response.OkWithoutData()
    }

    abstract updateCard(card: Card, data: Unidentified<CardDto>, requesterId: Id): Promise<void>
}