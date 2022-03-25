import {CardRepository} from '../domain/card/CardRepository.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {UserModifiesCardDataRequest} from './UserModifiesCardDataRequest.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'

export class UserModifiesCardDataUseCase extends WithAuthorizationUseCase<UserModifiesCardDataRequest, null> {
    constructor() {
        super(['id', 'question', 'answer', 'labelling'])
    }

    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {requesterId, id, authorId, ...cardData} = request
        const cardRepository = new CardRepository()
        const originalCard = await cardRepository.findById(new CardIdentification(id))
        const updatedCard = new CardFactory().apply(originalCard, cardData, await this.getRequesterPermissions())
        await cardRepository.update(updatedCard)
        return Response.OkWithoutData()
    }
}




