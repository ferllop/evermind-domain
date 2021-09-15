import { Datastore } from '../models/Datastore.js';
import { CardMapper } from '../models/card/CardMapper.js'
import { ErrorType } from '../errors/ErrorType.js'
import { Card } from '../models/card/Card.js'
import { AuthorIdentification } from '../models/card/AuthorIdentification.js'
import { WrittenQuestion } from '../models/card/WrittenQuestion.js'
import { WrittenAnswer } from '../models/card/WrittenAnswer.js'
import { Labelling } from '../models/card/Labelling.js'
import { UserCreatesCardRequest } from './UserCreatesCardRequest.js'
import { Response } from './Response.js';
import { CardRepository } from '../models/card/CardRepository.js';

export class UserCreatesCardUseCase {

    execute(request: UserCreatesCardRequest, datastore: Datastore): Response<null> {
        if (!new CardMapper().isDtoValid({...request, authorID: request.userId})) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const card = Card.create(
            new AuthorIdentification(request.userId),
            new WrittenQuestion(request.question),
            new WrittenAnswer(request.answer),
            Labelling.fromStringLabels(request.labelling)
        )

        const error = new CardRepository(datastore).store(card)
        return new Response(error.getCode(), null)
    }

}
