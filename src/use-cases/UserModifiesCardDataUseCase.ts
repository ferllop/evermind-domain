import {CardRepository} from '../domain/card/CardRepository.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {UserModifiesCardDataRequest} from './UserModifiesCardDataRequest.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'

export class UserModifiesCardDataUseCase extends WithAuthorizationUseCase<UserModifiesCardDataRequest, null> {
    constructor() {
        super(['id', 'question', 'answer', 'labelling'])
    }

    protected async internalExecute(request: UserModifiesCardDataRequest) {
        const {requesterId, id, authorId, ...cardData} = request
        const cardRepository = new CardRepository()
        const originalCard = await cardRepository.findById(new CardIdentification(id))
        const userPermissions = await new PermissionRepository().findUserPermissions(RequesterIdentification.recreate(requesterId))
        const updatedCard = new CardFactory().apply(originalCard, cardData, userPermissions)
        await new CardRepository().update(updatedCard)
        return Response.OkWithoutData()
    }
}




