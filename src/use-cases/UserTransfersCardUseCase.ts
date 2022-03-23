import {UserRepository} from '../domain/user/UserRepository.js'
import {AuthorIdentification} from '../domain/card/AuthorIdentification.js'
import {CardRepository} from '../domain/card/CardRepository.js'
import {RequesterIdentification} from '../domain/authorization/permission/RequesterIdentification.js'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'
import {Response} from './Response.js'
import {UserTransfersCardRequest} from './UserTransfersCardRequest.js'

export class UserTransfersCardUseCase extends WithAuthorizationUseCase<UserTransfersCardRequest, null> {
    constructor() {
        super(['cardId', 'authorId'])
    }

    protected async internalExecute(request: UserTransfersCardRequest) {
        const {requesterId, cardId, authorId } = request
        const cardRepository = new CardRepository()
        const card = await cardRepository.findById(CardIdentification.recreate(cardId))
        const user = await new UserRepository().findById(AuthorIdentification.recreate(authorId))
        await cardRepository.transfer(card, user, RequesterIdentification.recreate(requesterId))
        return Response.OkWithoutData()
    }
}