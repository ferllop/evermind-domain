import {CardRepository} from '../domain/card/CardRepository.js'
import {UserModifiesCardDataRequest} from 'evermind-types'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardFactory} from '../domain/card/CardFactory.js'

export class UserModifiesCardDataUseCase extends WithAuthorizationUseCase<UserModifiesCardDataRequest, null> {
    constructor() {
        super(['id', 'question', 'answer', 'labelling'])
    }

    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {requesterId, id, authorId, ...cardData} = request
        const authorization = await this.getAuthorization()
        const cardRepository = new CardRepository(authorization)
        const originalCard = await cardRepository.findById(new CardIdentification(id))
        const updatedCard = new CardFactory(authorization).apply(originalCard, cardData)
        await cardRepository.update(updatedCard)
        return Response.OkWithoutData()
    }
}




