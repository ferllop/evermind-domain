import {AuthorIdentification} from '../domain/card/AuthorIdentification.js'
import {Card} from '../domain/card/Card.js'
import {CardMapper} from '../domain/card/CardMapper.js'
import {Labelling} from '../domain/card/Labelling.js'
import {WrittenAnswer} from '../domain/card/WrittenAnswer.js'
import {WrittenQuestion} from '../domain/card/WrittenQuestion.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'

export class UserCreatesCardUseCase {

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

        const error = await new CardRepository().add(card)
        return new Response(error.getCode(), null)
    }

}
