import {UserRepository} from '../domain/user/UserRepository.js'
import {AuthorIdentification} from '../domain/card/AuthorIdentification.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {UserTransfersCardRequest} from './UserTransfersCardRequest.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {PermissionRepository} from '../domain/authorization/permission/PermissionRepository.js'

export class UserTransfersCardUseCase extends WithAuthorizationUseCase<UserTransfersCardRequest, null> {
    constructor() {
        super(['cardId', 'authorId'])
    }

    protected async internalExecute(request: UserTransfersCardRequest) {
        const {requesterId, cardId, authorId } = request
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(CardIdentification.recreate(cardId))
        const receiverUser = await new UserRepository().findById(AuthorIdentification.recreate(authorId))
        const requesterPermissions = await new PermissionRepository().findUserPermissions(RequesterIdentification.recreate(requesterId))
        const transferredCard = new CardFactory().transferCardToUser(card, receiverUser, requesterPermissions)
        await cardRepository.update(transferredCard)
        return Response.OkWithoutData()
    }
}