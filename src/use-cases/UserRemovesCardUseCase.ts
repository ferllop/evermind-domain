import {CardRepository} from '../domain/card/CardRepository.js'
import {Response} from './Response.js'
import {UserRemovesCardRequest} from 'evermind-types'
import {WithAuthorizationUseCase} from './WithAuthorizationUseCase.js'
import {CardIdentification} from '../domain/card/CardIdentification.js'

export class UserRemovesCardUseCase extends WithAuthorizationUseCase<UserRemovesCardRequest, null> {

    constructor() {
        super(['id'])
    }

    protected async internalExecute(request: UserRemovesCardRequest): Promise<Response<null>> {
        const cardId = CardIdentification.recreate(request.id)
        const cardRepository = await new CardRepository(await this.getAuthorization())
        const card = await cardRepository.findById(cardId)
        await cardRepository.delete(card)
        return Response.OkWithoutData()
    }

}
