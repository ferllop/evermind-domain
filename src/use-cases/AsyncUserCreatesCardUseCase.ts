import {AuthorIdentification} from '../models/card/AuthorIdentification.js'
import {Card} from '../models/card/Card.js'
import {CardMapper} from '../models/card/CardMapper.js'
import {Labelling} from '../models/card/Labelling.js'
import {WrittenAnswer} from '../models/card/WrittenAnswer.js'
import {WrittenQuestion} from '../models/card/WrittenQuestion.js'
import {ErrorType} from '../models/errors/ErrorType.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {AsyncCardRepository} from '../models/card/AsyncCardRepository.js'

export class AsyncUserCreatesCardUseCase {

    async execute(request: UserCreatesCardRequest): Promise<Response<null>> {
        if (!new CardMapper().isDtoValid({...request, authorID: request.userId})) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }
        
        const card = Card.create(
            new AuthorIdentification(request.userId),
            new WrittenQuestion(request.question),
            new WrittenAnswer(request.answer),
            Labelling.fromStringLabels(request.labelling)
        )

        const error = await new AsyncCardRepository().add(card)
        return new Response(error.getCode(), null)
    }

}
