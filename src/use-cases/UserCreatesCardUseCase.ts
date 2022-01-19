import {AuthorIdentification} from '../domain/card/AuthorIdentification.js'
import {CardFactory} from '../domain/card/CardFactory.js'
import {Labelling} from '../domain/card/Labelling.js'
import {WrittenAnswer} from '../domain/card/WrittenAnswer.js'
import {WrittenQuestion} from '../domain/card/WrittenQuestion.js'
import {ErrorType} from '../domain/errors/ErrorType.js'
import {Response} from './Response.js'
import {UserCreatesCardRequest} from './UserCreatesCardRequest.js'
import {CardRepository} from '../domain/card/CardRepository.js'

export class UserCreatesCardUseCase {

    async execute(request: UserCreatesCardRequest): Promise<Response<null>> {
        if (!new CardFactory().isDtoValid({...request, authorID: request.userId})) {
            return new Response(ErrorType.INPUT_DATA_NOT_VALID, null)
        }

        const card = new CardFactory().create(
            new AuthorIdentification(request.userId),
            new WrittenQuestion(request.question),
            new WrittenAnswer(request.answer),
            Labelling.fromStringLabels(request.labelling)
        )

        try {
            await new CardRepository().add(card)
            return Response.OkWithoutData()
        } catch(error) {
            return Response.withError(error)
        }
    }

}
