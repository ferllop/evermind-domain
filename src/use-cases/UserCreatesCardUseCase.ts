import { CardController } from '../controllers/CardController.js'
import { Response } from '../models/value/Response.js'
import { Datastore } from '../storage/datastores/Datastore.js'
import { CardMapper } from '../storage/storables/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Card } from '../models/card/Card.js'
import { AuthorIdentification } from '../models/card/AuthorIdentification.js'
import { WrittenQuestion } from '../models/card/WrittenQuestion.js'
import { WrittenAnswer } from '../models/card/WrittenAnswer.js'
import { Labelling } from '../models/card/Labelling.js'
import { UserCreatesCardRequest } from './UserCreatesCardRequest.js'

export class UserCreatesCardUseCase {

    execute(request: UserCreatesCardRequest, datastore: Datastore): Response<null> {
        if (!new CardMapper().isDtoValid({...request, authorID: request.userId})) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const card = Card.create(
            new AuthorIdentification(request.userId),
            new WrittenQuestion(request.question),
            new WrittenAnswer(request.answer),
            new Labelling(request.labelling)
        )

        const error = new CardController().storeCard(card, datastore)
        return new Response(error.getType(), null)
    }

}